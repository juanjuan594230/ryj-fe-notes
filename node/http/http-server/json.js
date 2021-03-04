const http = require('http');

// 提供路由功能 不同的路由返回不同的内容
// /books return book list
// /authors return author list
const host = 'localhost';
const port = 8000;
const books = JSON.stringify([
    { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
    { title: "The Prophet", author: "Kahlil Gibran", year: 1923 }
]);
const authors = JSON.stringify([
    { name: "Paulo Coelho", countryOfBirth: "Brazil", yearOfBirth: 1947 },
    { name: "Kahlil Gibran", countryOfBirth: "Lebanon", yearOfBirth: 1883 }
])

// const requestListener = function(req, res) {
//     // console.log('request');
//     // console.log(res instanceof http.ServerResponse); // true
//     // console.log(req instanceof http.IncomingMessage); // true
//     res.setHeader('Content-Type', 'application/json');
//     res.writeHead(200);
//     res.end(`{"message": "this is a json response"}`); // 为什么一定要包裹在``里面
// }

const requestListener = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log('url', req.url);
    switch(req.url) {
        case '/books':
            res.writeHead(200);
            res.end(books);
            break;
        case '/authors':
            res.writeHead(200);
            res.end(authors);
            break;
        default:
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
    }
}

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})