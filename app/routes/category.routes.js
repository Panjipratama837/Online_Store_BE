module.exports = (app) => {
    const categories = require('../controllers/category.controller')

    const router = require('express').Router();

    router.get('/', categories.findAllCategories);
    router.post('/create', categories.create)
    router.delete('/delete/:id', categories.delete)

    app.use('/api/categories', router)
}