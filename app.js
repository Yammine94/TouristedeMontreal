var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Attraction = require("./models/attraction"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")

//requiring routes
var commentRoutes = require("./routes/comments"),
    attractionRoutes = require("./routes/attractions"),
    indexRoutes = require("./routes/index")



mongoose.connect("mongodb://Yammine94:Muaythai1994@ds141490.mlab.com:41490/touristemontreal");
//mongodb://localhost/yelp_tourism_canada





app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB(); 

// PASSPORT-Js CONFIGURATION
app.use(require("express-session")({
    secret: "Bedu is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/attractions", attractionRoutes);
app.use("/attractions/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The Server Has Started!");
});