const https = require('https');

const request = https.get('https://jsonplaceholder.typicode.com/users?_limit=2', (res) => {
    // console.log('res'); // IncomingMessage 访问响应状态、消息头、数据等
    // console.log(res.req); // clientRequest
    if (res.statusCode !== 200) {
        console.log('error');
    }

    let data = '';

    // when the response object emits a data event, you will take the data it received and add it to your data variable.
    res.on('data', (chunk) => {
        // console.log('chunk', chunk);
        data += chunk; // Node.js分块传输响应数据
    });

    // When all the data from the server is received, Node.js emits a close event.
    res.on('close', () => {
        console.log('Retrieved all data');
        console.log('data', data);
        console.log(JSON.parse(data));
    })
});

// console.log('request', request); // clientRequest