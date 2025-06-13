# Browser MCP

A Model Context Protocol (MCP) server implementation for browser interactions.

## MCP Server Inspector

The MCP Server Inspector provides a development interface for testing and debugging the MCP server.

### Configuration

- **Client UI**: Runs on port `9001` (the default port 5173 conflicts with the extension's Vite development server)
- **MCP Proxy Server**: Runs on port `9002` (the default port 3000 conflicts with the marketing application)

### Getting Started

1. **Build the server**
   ```bash
   pnpm build
   ```
   
   Or for continuous development with watch mode:
   ```bash
   pnpm watch
   ```
   
   This will generate the compiled output in `dist/index.js`

2. **Start the inspector**
   ```bash
   pnpm inspector
   ```

3. **Access the inspector UI**
   
   Navigate to [http://localhost:9001?proxyPort=9002](http://localhost:9001?proxyPort=9002)

4. **Connect to the MCP server**
   
   Click the **Connect** button in the UI to execute `dist/index.js` and establish connection with the MCP server