const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/auth/signin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const data = JSON.stringify({
  email: 'admin@nishat.com',
  password: 'admin123'
});

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log(`Response: ${body}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();
