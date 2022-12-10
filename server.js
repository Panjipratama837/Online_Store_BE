const express = require('express');
const app = express();
const Sequelize = require("sequelize");
const cors = require("cors");
const moongose = require("mongoose");
const port = 5000;

// Database connection
moongose.connect("mongodb://localhost:27017/agis_store", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

moongose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

moongose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
});

// get all data from database
// create model user
const User = moongose.model("user", {
    username: String,
    password: String,

});

// get all data from database
// create model product




app.get("/users", (req, res) => {
    User.find({}, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }

    });



    // Middleware




    var corsOptions = {
        origin: "http://localhost:5000"
    };
    app.use(cors(corsOptions));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
        res.json({ message: "Welcome to the application." });
    });



    app.listen(port, () => {
        console.log(`Server app listening at http://localhost:${port}`);
    });