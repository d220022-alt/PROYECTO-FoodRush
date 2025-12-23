const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/productos?limit=5',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        // Assuming tenant middleware uses this or defaults to something
        'X-Tenant-ID': '1'
    }
};

const req = http.request(options, (res) => {
    let data = '';

    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Body:');
        console.log(data);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
