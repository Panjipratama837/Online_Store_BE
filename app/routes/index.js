const loginRouter = require('./login.routes');
const biodataRouter = require('./biodata.routes');
const postRouter = require('./post.routes');
const productRouter = require('./product.routes');

module.exports = app => {
    loginRouter(app);
    biodataRouter(app);
    postRouter(app);
    productRouter(app);
};