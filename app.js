const fs = require('fs');
const http = require('http');
const https = require('https');
const fsbatch = require('./fsbatch');
const md5 = require('md5');
const shorthash = require('shorthash');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const privateKey  = fs.readFileSync('ssl/ssl.key', 'utf8');
const certificate = fs.readFileSync('ssl/a7f71c64c784568c.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use(express.static('client'));
app.use(express.static('files'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/code/*', function(req, res) {
    res.setHeader("Content-Type", "text/plain");
    res.sendFile(__dirname + req.path);
});

app.post('/save', function(req, res) {
    var code = req.body.code;
    var html = req.body.html;

    if(!code || !html) {
        res.json({
            success: false,
            error: 'Invalid arguments'
        });
        return;
    }

    var hash = shorthash.unique(md5(html));
    var htmlFilePath = __dirname + '/files/' + hash + '.html';
    var codeFilePath = __dirname + '/code/' + hash;

    fsbatch([{
        path: htmlFilePath,
        content: html
    }, {
        path: codeFilePath,
        content: code
    }], function(err) {
        res.json({
            success: !err,
            error: err && err.message || 0,
            hash: hash
        });
    });
});

app.get('/*', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/client/index.html');
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(3000);
httpsServer.listen(3001);
