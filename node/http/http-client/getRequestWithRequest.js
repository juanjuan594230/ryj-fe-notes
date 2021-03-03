const { IncomingMessage } = require('http');
const https = require('https');

// request ClientRequest extends Stream
// request(url, options, callback)
// const request = https.request(
//     'https://jsonplaceholder.typicode.com/users?_limit=2',
//     {
//         method: 'GET'
//     },
//     (res) => {
//         console.log('res');
//         if (res.statusCode !== 200) {
//             console.log('response error');
//         }
//         console.log(res instanceof IncomingMessage); // true stream.Readable
//         let data = '';
//         res.on('data', (chunk) => {
//             data += chunk
//         });

//         res.on('close', () => {
//             console.log('data receive finish');
//             console.log(JSON.parse(data));
//         })
//     }
// );

// // This is an important method that must be called when using the request() function.
// // It completes the request, allowing it to be sent.
// // If you don’t call it, the program will never complete, as Node.js will think you still have data to add to the request.
// // 完成发送请求
// request.end(); // 未调用 throw error socket hang up https.get() will call end auto;

// request.on('error', () => {
//     console.log('request error');
// });

// request(options, callback)
// config options
const options = {
    method: 'GET',
    protocol: 'https:',
    host: 'jsonplaceholder.typicode.com',
    path: '/users?_limit=2',
    header: {
        accept: 'application/json'
    }
}

const request = https.request(
    options,
    (res) => {
        console.log('res');
        if (res.statusCode !== 200) {
            console.log('response error');
        }
        console.log(res instanceof IncomingMessage); // true stream.Readable
        let data = '';
        res.on('data', (chunk) => {
            data += chunk
        });

        res.on('close', () => {
            console.log('data receive finish');
            console.log(JSON.parse(data));
        })
    }
);
request.end();