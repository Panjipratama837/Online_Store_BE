const db = require('../models');
const post = db.posts;

// find with pagination
exports.findAllPagination = (req, res) => {
    const page = req.query.page;
    const size = req.query.size;

    post.find()
        .countDocuments()
        .then(count => {
            const totalPage = Math.ceil(count / size);
            const skip = (page - 1) * size;
            post.find()
                .skip(skip)
                .limit(size * 1)
                .then(result => {
                    res.send({
                        totalPage: totalPage,
                        totalData: count,
                        article: result
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
    post.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving posts.'
            });
        });
}

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    const newPost = new post({
            title: req.body.title,
            description: req.body.description,
            published: req.body.published ? req.body.published : false,
            name : {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
    });

    newPost.save(newPost)
        .then(result => {
            res.send({ message: 'Success add Post !!' });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Post.'
            });
        });
}

exports.findOne = (req, res) => {
    const id = req.params.id;

    post.findById(id)
        .then(result => {
            if (!result)
                res.status(404).send({ message: 'Not found Post with id ' + id });
            else res.send(result);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: 'Error retrieving Post with id=' + id });
        });
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'Data to update can not be empty!'
        });
    }

    const id = req.params.id;

    post.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(result => {
            if (!result) {
                res.status(404).send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found!`
                });
            } else res.send({ message: 'Post was updated successfully.' });
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error updating Post with id=' + id
            });
        });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    post.findByIdAndRemove(id)
        .then(result => {
            if (!result) {
                res.status(404).send({
                    message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
                });
            } else {
                res.send({
                    message: 'Post was deleted successfully!'
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
    post.deleteMany({})
        .then(result => {
            res.send({
                message: `${result.deletedCount} Posts were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while removing all posts.'
            });
        });
}