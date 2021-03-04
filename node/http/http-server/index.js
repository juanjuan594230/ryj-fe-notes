const http = require('http');

const host = 'localhost';
const port = 3000; // web server process will run on 3000 port

const requestListener = function(request, response) {
    // request The request object captures all the data of the HTTP request that’s coming in.
    // response  The response object is used to return HTTP responses for the server.
    response.writeHead(200);
    response.end('My first server!');
}

// server accept http request, and passes them to requestListener fn.
// 等价于 server.on('request', requestListener);
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


