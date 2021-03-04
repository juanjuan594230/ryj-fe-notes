# How To Create a Web Server in Node.js with the HTTP Module

> When you view a webpage in your browser, you are making a request to another computer on the internet, which then provides you the webpage as a response. That computer you are talking to via the internet is a web server. A web server receives HTTP requests from a client, like your browser, and provides an HTTP response, like an HTML page or JSON from an API.

> Node.js allows developers to use JavaScript to write back-end code

```javascript
http.createServer((req, res) => {
    console.log(res instanceof http.ServerResponse); // true
    console.log(req instanceof http.IncomingMessage); // true
});

IncomingMessage 是一个stream.Readable

const request<ClientRequest> = http.request(options, (res<IncomingMessage>) => {})
```

HTTP server中，request是IncomingMessage的实例，可读流；res是ServerResponse的实例，继承自stream
HTTP client中，request是ClientRequest的实例，继承自stream; response是IncomingMessage的实例，继承自stream.Readable


## return different types of content

- Content-Type


### JSON

javascript object notation  learn more:  https://www.digitalocean.com/community/tutorials/how-to-work-with-json-in-javascript

传输体积小
解析方便

```javascript
// ./json.js
const host = 'localhost';
const port = 8000;

const requestListener = function(req, res) {
    // console.log('request');
    // console.log(res instanceof http.ServerResponse); // true
    // console.log(req instanceof http.IncomingMessage); // true
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(`{"message": "this is a json response"}`); // 为什么一定要包裹在``里面
}

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})
```

## routes management