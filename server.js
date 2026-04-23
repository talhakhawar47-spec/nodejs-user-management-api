// import built in http module to create a server
const http = require('http');

// import our routes file which handles all requests
const routes = require('./routes');

// create the server and pass routes as the handler
const server = http.createServer(routes);

// start listening on port 3000
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});