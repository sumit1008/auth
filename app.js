require('dotenv').config()
const express = require("express")
const Bodyparser = require("Body-parser")
const ejs = require("ejs")
const exp = require("constants");
const bodyParser = require("Body-parser");
const encrypt = require("mongoose-encryption")

const mongoose = require('mongoose');
const { stringify } = require("querystring");
mongoose.connect("mongodb://localhost:27017/userDB")

const app = express();

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
console.log(process.env.API_KEY)
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema)

app.post("/register", function functionName(req, res) {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })
        newUser.save(function(err) {
            if (err)
                console.log(err)
            else
                res.render("secrets")
        })
    }

)
app.post("/login", function(req, res) {
    const username = req.body.username
    const password = req.body.password
    User.findOne({ email: username }, function(err, founduser) {
        if (founduser)
            if (founduser.password === password) {
                res.render("secrets");
            }
    })
})


app.get("/", function(req, res) {
    res.render("home")
})
app.get("/register", function(req, res) {
    res.render("register")
})
app.get("/login", function(req, res) {
    res.render("login")
})




app.listen(3000, function() {
    console.log("runnig at 3000");
})