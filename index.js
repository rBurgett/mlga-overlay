const express = require('express'),
    favicon = require('serve-favicon'),
    path = require('path'),
    fs = require('fs-extra'),
    multipart = require('connect-multiparty'),
    co = require('co'),
    sharp = require('sharp'),
    uuid = require('node-uuid');

const handleError = err => console.error(err);

fs.ensureDirSync('uploads');
fs.ensureDirSync(path.join('public', 'images'));

const baseImage = fs.readFileSync(path.join('public', 'mlga_base.png'));

const app = express()
    .use(express.static('public'))
    .use(favicon(path.join('public', 'favicon.ico')))
    .use(multipart({
        uploadDir: 'uploads'
    }));

app.post('/', (req, res) => {
    co(function*() {
        try {
            if (!req.files.imageFile || !/image/.test(req.files.imageFile.type)) res.sendStatus(400);
            const { path: imagePath } = req.files.imageFile;
            const clientImage = sharp(imagePath);
            const meta = yield clientImage.metadata();

            let resizedImage;
            if (meta.width > meta.height) {
                resizedImage = clientImage.resize(300, null);
            } else { // height is greater than width
                resizedImage = clientImage.resize(null, 300);
            }

            const resizedImagePath = path.join('uploads', uuid.v4() + path.extname(imagePath));
            yield resizedImage.toFile(resizedImagePath);
            const newMeta = yield sharp(resizedImagePath).metadata();

            const finalImagePath = path.join('public', 'images', uuid.v4() + path.extname(imagePath));
            yield sharp(baseImage)
                .overlayWith(resizedImagePath, {
                    top: 250 - parseInt(newMeta.height / 2, 10),
                    left: 250 - parseInt(newMeta.width / 2, 10)
                })
                .toFile(finalImagePath);
            const promises = [imagePath, resizedImagePath]
                .map(p => new Promise((resolve, reject) => {
                    fs.remove(p, err => {
                        if (err) reject(err);
                        else resolve();
                    });
                }));
            yield Promise.all(promises);

            res.send(`/images/${path.basename(finalImagePath)}`);
        } catch (err) {
            handleError(err);
            res.sendStatus(500);
        }
    });

});

const port = 80;

const server = app.listen(port, () => {
    console.log('App listening at port', server.address().port);
});