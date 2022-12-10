const db = require('../models');
const biodata = db.biodata;

exports.registerBiodata = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    // find by username
    biodata.findOne({ name: req.body.name })
        .then(result => {
            if (result) {
                res.status(400).send({ message: 'Username already exist' });
            } else {
                const newBiodata = new biodata({
                    name: req.body.name,
                    address: req.body.address,
                    // role: req.body.role
                });

                newBiodata.save(newBiodata)
                    .then(result => {
                        res.status(200).send({ message: 'Success add Biodata !!' });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({
                            message: err.message || 'Some error occurred while creating the User.'
                        });
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .send({ message: 'Error retrieving User with username=' });
        });
}

exports.findAllBiodata = (req, res) => {
    biodata.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving posts.'
            });
        });
}