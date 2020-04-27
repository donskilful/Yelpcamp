var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
const port = 3000;

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Db ok"))
    .catch(err => console.log(err));


app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// mongoose model configuration for members
var memberSchema = new mongoose.Schema({
    name: String,
    email: String,
    country: String,
    phone: Number,
    password: String,
    created: { type: Date, default: Date.now },
});
var member = mongoose.model("member", memberSchema);

// mongoose model configuration for camp
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    created: { type: Date, default: Date.now },
});
var camp = mongoose.model("camp", campSchema);


app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    camp.find().then(data => {
        res.render("campgrounds", { campgrounds: data });
    }).catch(err => {
        res.render("campgrounds", { campgrounds: [] });
    })
});



app.get("/members", function(req, res){
    member.find({}, function(err, members){
        if(err){
            console.log("ERROR!");
        }else{
            res.render("members", {members: members});
        }
    })
});










app.get("/register", function (req, res) {
    res.render('register');
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});


// Route to create new member
app.post("/members", function (req, res) {
    member.create(req.body).then(newMember => {
        members.find({}).then(data => {
            res.render("members", {
                members: data
            });

        })
    }).catch(err => {
        res.render("/register");

    })
});

// Route to create new campground
app.post("/campgrounds", function (req, res) {
    console.log(req.body);
    camp.create(req.body, function (err, newcamp) {
        
        if (err) {
            res.render("/new");
        } else {
            res.redirect("campgrounds");
        }
    })
});



console.log('Server ok')
app.listen(port);