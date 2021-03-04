const http = require('http');
const fs = require('fs').promises; // 提供了一组备用的异步文件系统API

const host = 'localhost';
const port = 8000;

let indexFile;

// return html file every request
// const requestListener = function(req, res) {
//     fs.readFile(__dirname + '/index.html') // __dirname 当前文件的目录名
//         .then((contents) => {
//             res.setHeader("Content-Type", "text/html");
//             res.writeHead(200);
//             res.end(contents);
//         })
//         .catch((err) => {
//             res.writeHead(500);
//             res.end();
//             return;
//         });
// }

const requestListener = function(req, res) {
    // 不是每次请求都返回整个HTML file
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(indexFile);
}

const server = http.createServer(requestListener);

fs.readFile(__dirname + '/index.html')
    .then(contents => {
        indexFile = contents;
        server.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    })

// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// })