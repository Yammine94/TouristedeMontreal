var Attraction = require("../models/attraction");
var Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkAttractionOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Attraction.findById(req.params.id, function(err, foundAttraction) {
            if (err) {
                req.flash("error", "Attraction was not found!");
                res.redirect("back");
            } else {

                if (foundAttraction.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that..");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {

                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that..")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that..");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You do not have permission to do that. Please login");
    res.redirect("/login");
}

module.exports = middlewareObj;