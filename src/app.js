const express = require('express');
const path = require('path');
const http = require('http');
const captchaGenerator = require('./captchaGenerator');

const port = process.env.PORT || 6969;
const app = express();
const server = http.Server(app);
// eslint-disable-next-line import/order
const io = require('socket.io')(server);

process.on('unhandledRejection', (reason, p) => {
    console.error(p, reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception: ', err);
});

function emitGenerateCaptcha(socket) {
    let captcha;
    try {
        captcha = captchaGenerator.generate();
    } catch (e) {
        console.log('Captcha generate error', e);
        return;
    }
    socket.emit('captcha', { captcha: captcha.image });
    socket.userCaptcha = captcha.code;
}

io.on('connection', (socket) => {
    emitGenerateCaptcha(socket);
    socket.on('message', (data) => {
        if (+data.captcha !== socket.userCaptcha) {
            socket.emit('error_captcha', { test: 'test' });
        } else {
            io.emit('new_message', {
                text: data.text,
                author: data.author,
                dateTime: new Date(),
            });
        }
        emitGenerateCaptcha(socket);
    });
});

app.use(express.static(path.join(__dirname, '../dist')));

server.listen(port, () => {
    console.log(`Server is listening on ${port}!`);
});
