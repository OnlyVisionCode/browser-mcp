import { WebSocket } from "ws";
import { MESSAGE_RESPONSE_TYPE } from "./types.js";

export function createSocketMessageSender(ws: WebSocket) {
  async function sendSocketMessage(type: string, payload: any, options = { timeoutMs: 30000 }) {
    const { timeoutMs } = options;
    const id = generateId();
    const message = { id, type, payload };
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        removeSocketMessageResponseListener();
        ws.removeEventListener("error", errorHandler);
        ws.removeEventListener("close", cleanup);
        clearTimeout(timeoutId);
      };
      let timeoutId: any;
      if (timeoutMs) {
        timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error(`WebSocket response timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      }
      const removeSocketMessageResponseListener = addSocketMessageResponseListener(ws, async (responseMessage) => {
        const { payload: payload2 } = responseMessage;
        if (payload2.requestId !== id) {
          return;
        }
        const { result, error } = payload2;
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
        cleanup();
      });
      const errorHandler = (_event: any) => {
        cleanup();
        reject(new Error("WebSocket error occurred"));
      };
      ws.addEventListener("error", errorHandler);
      ws.addEventListener("close", cleanup);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      } else {
        cleanup();
        reject(new Error("WebSocket is not open"));
      }
    });
  }
  return { sendSocketMessage };
}

function addSocketMessageResponseListener(ws: WebSocket, typeListener: (message: any) => Promise<void>) {
  const listener = async (event: any) => {
    const message = JSON.parse(event.data.toString());
    if (message.type !== MESSAGE_RESPONSE_TYPE) {
      return;
    }
    await typeListener(message);
  };
  ws.addEventListener("message", listener);
  return () => ws.removeEventListener("message", listener);
}

function generateId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
} 