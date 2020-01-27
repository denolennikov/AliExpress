import http from "http";
import app from "./app";
require('dotenv').config()
//Use system configuration for port or use 6001 by default.
const port = process.env.PORT || 4000;
 
//Create server with exported express app
const server = http.createServer(app);
console.log('The server is running in ' + port + ' port.');
server.listen(port);