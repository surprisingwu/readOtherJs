var http = require('http')

http.createServer(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write('Hello, world!')
    res.end()
}).listen(8000, function() {
    console.log('server is starting')
})