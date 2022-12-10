const db = require('../models');
const bycrypt = require('bcryptjs');
const JWT = require("jsonwebtoken");
const AUTH_CONFIG = require("../config/auth.config");
const login = db.login;


exports.login = (req, res) => {
    if (!req.body.username) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    login.findOne({
        username: req.body.username
    })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: 'Not found User with username ' + req.body.username });
            } else {
                bycrypt.compare(req.body.password, data.password, (err, result) => {
                    if (err) {
                        res.status(401).send({ message: 'Unauthorized' });
                    }
                    if (result) {
                        const token = JWT.sign(
                            { username: data.username },
                            AUTH_CONFIG.jwt_key,
                            { expiresIn: '1h' }
                        );
                        res.status(200).send({
                            token: token,
                            expiresIn: 3600,
                            // id: data._id,
                            username: data.username,
                            message: 'Login Success'
                        });
                    } else {
                        res.status(401).send({ message: 'Unauthorized' });
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving tutorials.'
            });
        });
};



exports.register = (req, res) => {
    if (!req.body.username) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    // find by username
    login.findOne({ username: req.body.username })
        .then(result => {
            if (result) {
                res.status(400).send({ message: 'Username already exist' });
            } else {
                const newLogin = new login({
                    username: req.body.username,
                    password: bycrypt.hashSync(req.body.password, 10)
                    // role: req.body.role
                });

                newLogin.save(newLogin)
                    .then(result => {
                        res.status(200).send({ message: 'Success add User !!' });
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

exports.findAll = (req, res) => {
    login.find()
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
