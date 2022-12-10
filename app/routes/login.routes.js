module.exports = (app) => {
    const login = require('../controllers/login.controller');
    const router = require('express').Router();

    router.post('/login', login.login);
    router.post('/register', login.register);
    router.get('/findall', login.findAll);
    app.use('/api', router);
}