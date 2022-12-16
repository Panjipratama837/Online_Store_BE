const db = require('../models')
const category = db.category;

exports.findAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;
        const search = req.query.search || '';

        const allCategories = await category.find({
            categoryName: { $regex: search, $options: 'i' }
        })
            .skip((page - 1) * size)
            .limit(size * 1);

        const total = await category.countDocuments({
            categoryName: { $regex: search, $options: 'i' }
        })

        res.send({
            data: allCategories,
            total,
            page: Math.ceil(total / size),
            size,
            error: false
        })


    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || 'Some error occurred while retrieving caegories'
        })
    }
}

exports.create = async (req, res) => {
    try {
        if (!req.body.categoryName) {
            res.status(400).send({
                message: 'Content can not be empaty!'
            });
            return
        }

        const newCategory = new category({
            categoryName: req.body.categoryName,
        })


        newCategory.save(newCategory)
            .then(result => {
                res.status(200).send({
                    message: 'Success add category !'
                })
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while creating the category'
                });
            });

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || 'Some error occurred while retrieving caegories'
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const id = req.params.id

        category.findByIdAndRemove(id)
            .then(result => {
                if (!result) {
                    res.status(404).send({
                        message: `Cannot delete category with id=${id}. Maybe category was not found`
                    })
                } else {
                    res.send({
                        message: 'Category was deleted successfully'
                    })
                }
            })

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || 'Some error occurred while retrieving caegories'
        })
    }
}