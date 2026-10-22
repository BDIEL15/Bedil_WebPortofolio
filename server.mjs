import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.woff2':'font/woff2','.json':'application/json','.png':'image/png','.glsl':'text/plain'};
http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/prototype/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
