module.exports = (app) => {
    const posts = require('../controllers/post.controller');

    const router = require('express').Router();

    router.get('/', posts.findAllPagination);
    router.post('/create', posts.create);
    router.get('/detail/:id', posts.findOne);
    router.put('/update/:id', posts.update);
    router.delete('/delete/:id', posts.delete);
    router.delete('/deleteAll', posts.deleteAll);
    app.use('/api/posts', router);


}