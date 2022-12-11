module.exports = (app) => {
    const products = require('../controllers/product.controller');

    const router = require('express').Router();

    // router.get('/', products.findAllPagination);
    router.get('/', products.findAllProduct);
    // router.get('/', products.findAll);
    router.post('/create', products.create);
    router.get('/detail/:id', products.findOne);


    router.patch('/update/:id', products.update);
    router.delete('/delete/:id', products.delete);
    router.delete('/deleteAll', products.deleteAll);
    app.use('/api/products', router);


}