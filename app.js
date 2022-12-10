const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models/');
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true

    })
    .then(() => {
        console.log('Connected to the database!');
    }).catch(err => {
        console.log('Cannot connect to the database!', err);
        process.exit();
    });


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the application.' });
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

require('./app/routes')(app);

const port = 8000;
app.listen(port, () => console.log(`Listening on port: ${port}`));


