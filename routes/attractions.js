var express = require("express");
var router = express.Router();
var Attraction = require("../models/attraction");
var middleware = require("../middleware");
var geocoder = require("geocoder");


//INDEX 
router.get("/", function(req, res) {

    Attraction.find({}, function(err, allAttractions) {
        if (err) {
            console.log(err);
        } else {
            res.render("attractions/index", { attractions: allAttractions });
        }
    });
});

//CREATE 
router.post("/", middleware.isLoggedIn, function(req, res) {

    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newAttraction = { name: name, image: image, price: price, description: desc, author: author, location: location, lat: lat, lng: lng }

    Attraction.create(newAttraction, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {

            console.log(newlyCreated);
            res.redirect("/attractions");
        }
        });
    });
});

//NEW 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("attractions/new");
});

// SHOW 
router.get("/:id", function(req, res) {

    Attraction.findById(req.params.id).populate("comments").exec(function(err, foundAttraction) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundAttraction)

            res.render("attractions/show", { attraction: foundAttraction });
        }
    });
});

// EDIT 
router.get("/:id/edit", middleware.checkAttractionOwnership, function(req, res) {
    Attraction.findById(req.params.id, function(err, foundAttraction) {
        res.render("attractions/edit", { attraction: foundAttraction });
    });
});

// UPDATE
router.put("/:id", middleware.checkAttractionOwnership, function(req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, price: req.body.price, description: req.body.description, location: location, lat: lat, lng: lng}
    Attraction.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedAttraction) {
        if (err) {
            req.flash("error", "Update Unsuccessful");
            res.redirect("/attractions");
        } else {
            req.flash("success", "Update Successful!")
            res.redirect("/attractions/" + req.params.id);
        }
        });
    });
});

// DESTROY 
router.delete("/:id", middleware.checkAttractionOwnership, function(req, res) {
    Attraction.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/attractions");
        } else {
            res.redirect("/attractions");
        }
    });
});


module.exports = router;