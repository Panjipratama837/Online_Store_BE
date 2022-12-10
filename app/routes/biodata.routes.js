module.exports = (app) => {
    const biodata = require('../controllers/biodata.controller');

    const router = require('express').Router();

    router.post('/biodata', biodata.registerBiodata);
    router.get('/allbiodata', biodata.findAllBiodata);
    app.use('/bio', router);

}