const db = require('../models');
const product = db.product;

exports.findAllProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;
        const search = req.query.search || '';
        let sort = req.query.sort || '';
        let sortQuantity = req.query.sortQuantity || '';
        let category = req.query.category || 'all';
        let price = req.query.price || 10000000;

        const categoryOptions = [
            "t-shirt",
            "shirt",
            "pants",
            "jacket",
        ];

        category === 'all'
            ? category = [...categoryOptions]
            : category = category.split(',');

        // sort === 'desc'
        const persistProduct = await product.find();

        const allProducts = await product.find({
            category: { $in: [...category] },
            productName: { $regex: search, $options: 'i' },
            price: { $lte: price }
        })
            .sort((sort !== '') ? { totalQuantity: sort } : { updatedAt: 'desc' })

            .skip((page - 1) * size)
            .limit(size * 1);



        const total = await product.countDocuments({
            category: { $in: [...category] },
            productName: { $regex: search, $options: 'i' },
            price: { $lte: price }
        })



        // console.log(persistProduct);


        // const newData = allProducts.map((item) => {
        //     return {
        //         id: item._id,
        //         productName: item.productName,
        //         category: item.category,
        //         description: item.description,
        //         price: item.price,
        //         uploadPicture: item.uploadPicture,
        //         size: item.size,
        //         quantity: item.quantity,


        //         // New Items
        //         totalQuantity: item.quantity.map((item) => item[1]).reduce((a, b) => a + b)
        //     }
        // })

        res.send({
            data: allProducts,
            maxPrice: Math.max(...persistProduct.map((item) => item.price)),
            minPrice: Math.min(...persistProduct.map((item) => item.price)),
            total,
            page: Math.ceil(total / size),
            size,
            category: categoryOptions,
            error: false

        });



    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || 'Some error occurred while retrieving posts.'
        });

    }

}

exports.findAllPagination = (req, res) => {
    const page = req.query.page;
    const size = req.query.size;
    const category = req.query.category;
    const productName = req.query.productName;


    product.find()
        .countDocuments()
        .then(count => {
            const totalPage = Math.ceil(count / size);
            const skip = (page - 1) * size;
            product.find()
                .where('category').equals(category === 'all' ? /.*/ : category)
                // .where('productName').equals(productName === '' ? /.*/ : productName)
                .skip(skip)
                .limit(size * 1)
                .then(result => {
                    const newData = result.map((item) => {
                        return {
                            id: item._id,
                            productName: item.productName,
                            category: item.category,
                            description: item.description,
                            price: item.price,
                            uploadPicture: item.uploadPicture,
                            size: item.size,
                            quantity: item.quantity,

                            // New Items
                            totalQuantity: item.quantity.map((item) => item[1]).reduce((a, b) => a + b)
                        }
                    })

                    res.send({
                        totalPage: totalPage,
                        totalData: category === 'all' ? count : result.length,
                        data: newData
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || 'Some error occurred while retrieving posts.'
                    });
                });
        })
}




// find without pagination

exports.findAll = (req, res) => {
    product.find()
        .then(result => {
            const newData = result.map((item) => {
                return {
                    id: item._id,
                    productName: item.productName,
                    category: item.category,
                    description: item.description,
                    price: item.price,
                    uploadPicture: item.uploadPicture,
                    size: item.size,
                    quantity: item.quantity,

                    // New Items
                    totalQuantity: item.quantity.map((item) => item[1]).reduce((a, b) => a + b)
                }
            })

            res.send({
                data: newData,
                totalQuantity: result.map((item) => item.quantity.map((item) => item[1]).reduce((a, b) => a + b))
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving posts.'
            });
        });
}

exports.create = (req, res) => {
    if (!req.body.productName) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    const newProduct = new product({
        productName: req.body.productName,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        uploadPicture: req.body.uploadPicture,
        size: req.body.size,
        quantity: req.body.quantity,
        totalQuantity: req.body.totalQuantity
    });

    newProduct.save(newProduct)
        .then(result => {
            res.send({ message: 'Success add product !!' });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the product.'
            });
        });
}

exports.findOne = (req, res) => {
    const id = req.params.id;

    product.findById(id)
        .then(result => {
            if (!result)
                res.status(404).send({ message: 'Not found product with id ' + id });
            else res.send(result);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: 'Error retrieving product with id=' + id });
        });
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'Data to update can not be empty!'
        });
    }

    const id = req.params.id;

    product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(result => {
            if (!result) {
                res.status(404).send({
                    message: `Cannot update product with id=${id}. Maybe product was not found!`
                });
            } else res.send({ message: 'product was updated successfully.' });
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error updating product with id=' + id
            });
        });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    product.findByIdAndRemove(id)
        .then(result => {
            if (!result) {
                res.status(404).send({
                    message: `Cannot delete product with id=${id}. Maybe product was not found!`
                });
            } else {
                res.send({
                    message: 'product was deleted successfully!'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Could not delete Post with id=' + id
            });
        });
}

// delete all data post
exports.deleteAll = (req, res) => {
    product.deleteMany({})
        .then(result => {
            res.send({
                message: `${result.deletedCount} product were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while removing all product.'
            });
        });
}