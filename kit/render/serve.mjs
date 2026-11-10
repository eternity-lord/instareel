import {serve} from './lib.mjs';
const port=Number(process.env.PORT||3000);
const server=await serve({port,home:'/preview.html'});
console.log(`Reel studio listening on 0.0.0.0:${server.address().port}`);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
