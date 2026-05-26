import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter, DatabaseService } from './src/server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Boot database & seed default data if not present
DatabaseService.load();

async function startServer() {
  const app = express();
  app.use(express.json());
  
  // Support SOAP XML payloads
  app.use(express.text({ type: '*/xml' }));
  app.use(express.text({ type: 'application/xml' }));
  app.use(express.text({ type: 'text/xml' }));

  // Debug request logging
  app.use((req, res, next) => {
    console.log(`[REQ INFO] Method: ${req.method} | URL: ${req.url}`);
    next();
  });

  // 1. WSO2 ESB Gateway Intermediary Middleware (app-level rewrite)
  app.use((req, res, next) => {
    if (req.url.startsWith('/wso2/')) {
      const start = process.hrtime();
      const routePath = req.url.substring(5); // e.g., '/wso2/api/dashboard' -> '/api/dashboard'
      
      console.log(`[WSO2 ESB Gateway] Intercepted request path: ${req.url} | Forwarding to: ${routePath}`);
      
      const esbRoutingLatency = Math.round((4 + Math.random() * 5) * 100) / 100;
      
      const originalSend = res.send;
      res.send = function (body) {
        const diff = process.hrtime(start);
        const apiTime = Math.round((diff[0] * 1e9 + diff[1]) / 1e6 * 100) / 100;
        
        res.setHeader('X-Gateway-Server', 'WSO2-Carbon-ESB-v5.3.0');
        res.setHeader('X-Gateway-Processing-Ms', esbRoutingLatency.toString());
        res.setHeader('X-API-Execution-Total-Ms', (apiTime + esbRoutingLatency).toString());
        
        return originalSend.call(this, body);
      };

      req.url = routePath;
    } else if (req.url === '/wso2') {
      req.url = '/';
    }
    next();
  });

  // 2. Standard REST API prefix normalizer (app-level rewrite)
  app.use((req, res, next) => {
    if (req.url.startsWith('/api/')) {
      req.url = req.url.substring(4); // e.g., '/api/courses' -> '/courses'
    } else if (req.url === '/api') {
      req.url = '/';
    }
    next();
  });

  // 3. Mount SIAKAD backends
  app.use(apiRouter);

  // 4. Global backend error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[API BACKGROUND ERROR]', err);
    res.status(500).json({ success: false, message: `Internal system error: ${err.message || err}` });
  });

  // Vite development middleware vs Static files production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    
    // Fallback to React app
    app.get('*', (req, res, next) => {
      // If it's an API or SOAP request that wasn't matched, send to next (which falls to 404/fault)
      if (req.url.startsWith('/api') || req.url.startsWith('/soap') || req.url.startsWith('/wso2')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Boot listening on port 3000 as configured by AI Studio routing
  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SIAKAD Esa Unggul Server] Full-stack application ready.`);
    console.log(`- Gateway listening on: http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ESA Unggul SIAKAD Server:', err);
});
