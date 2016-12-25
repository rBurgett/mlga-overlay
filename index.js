const express = require('express'),
    favicon = require('serve-favicon'),
    path = require('path'),
    fs = require('fs-extra'),
    multipart = require('connect-multiparty');

const handleError = err => console.error(err);

fs.ensureDirSync('uploads');

const app = express()
    .use(express.static('public'))
    .use(favicon(path.join('public', 'favicon.ico')))
    .use(multipart({
        uploadDir: 'uploads'
    }));

app.post('/', (req, res) => {
    try {
        if (!req.files.imageFile || !/image/.test(req.files.imageFile.type)) res.sendStatus(400);
        // const { path: imagePath } = req.files.imageFile;
        res.sendStatus(200);
    } catch (err) {
        handleError(err);
        res.send(500);
    }
});

const port = 3300;

const server = app.listen(port, () => {
    console.log('App listening at port', server.address().port);
});