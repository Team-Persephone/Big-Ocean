const path = require('path');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

const PORT = process.env.PORT || 3000;
const app = express();
const socketio = require('socket.io');

const createApp = () => {
    app.use(morgan('dev'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(compression());

    app.use(express.static(path.join(__dirname, '..', 'public')));

    app.use((req, res, next) => {
        if(path.extname(req.path.length)) {
            const err = new Error('Not found');
            err.status = 404;
            next(err)
        } else {
            next();
        }
    })
}

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
});

app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
})

const startListening = () => {
    const server = app.listen(PORT, () => 
    console.log(`Serving swimmingly on port ${PORT}`)
    );

    const io = socketio(server);
    require('./socket')(io);
}

async function bootApp() {
    await createApp();
    await startListening();
}

//this evaluates as true when this file is run directly from our commandline,
//aka if we want to sun it on our browser (localhost) app will load and mount onto localhost, 
//if tirggered by test specs it will only creat app but not run on localhost again

if (require.main === module) {
    bootApp();
} else {
    createApp();
}


module.exports = app;