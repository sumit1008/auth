require('dotenv').config()
const express = require("express")
const Bodyparser = require("Body-parser")
const ejs = require("ejs")
const exp = require("constants");
const bodyParser = require("Body-parser");
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
    //const md5 = require('md5')
    // const bcrypt = require('bcrypt')
    // const saltRounds = 10;
    //const encrypt = require("mongoose-encryption")

const mongoose = require('mongoose');
const { stringify } = require("querystring");
mongoose.connect("mongodb://localhost:27017/userDB")

const app = express();

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'itsmyduckingsecret.',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
        email: String,
        password: String
    })
    //console.log(process.env.API_KEY)
    //userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/secrets", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets")
    } else { res.redirect("/login") }
})
app.post("/register", function(req, res) {
        User.register({ username: req.body.username }, req.body.password, function(err, user) {
            if (err)
                console.log(err)
            else
                passport.authenticate("local")(req, res, function() {
                    res.redirect("/secrets")
                })
        })



        // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        //     const newUser = new User({
        //         email: req.body.username,
        //         password: hash
        //     })
        //     newUser.save(function(err) {
        //         if (err)
        //             console.log(err)
        //         else
        //             res.render("secrets")
        //     })

        // });

    }

)
app.get("/logout", function(req, res) {
    req.logOut();
    res.redirect("/")

})

app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    req.login(user, function(err) {
            if (err)
                console.log(err)
            else {
                passport.authenticate("local")(req, res, function() {
                    res.redirect("/secrets")
                })
            }
        })
        // const username = req.body.username
        // const password = req.body.password
        // User.findOne({ email: username }, function(err, founduser) {
        //     if (founduser)
        //         bcrypt.compare(password, founduser.password, function(err, result) {
        //             if (result == true) { res.render("secrets"); }
        //         }); {

    //     }
    // })
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