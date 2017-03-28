var express = require("express");
var router = express.Router({ mergeParams: true });
var Attraction = require("../models/attraction");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments 
router.get("/new", middleware.isLoggedIn, function(req, res) {

    console.log(req.params.id);
    Attraction.findById(req.params.id, function(err, attraction) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { attraction: attraction });
        }
    })
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Attraction.findById(req.params.id, function(err, attraction) {
        if (err) {
            console.log(err);
            res.redirect("/attractions");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.created = req.user.created;
                    //save comment
                    comment.save();
                    attraction.comments.push(comment);
                    attraction.save();
                    console.log(comment);
                    res.redirect('/attractions/' + attraction._id);
                }
            });
        }
    });
});

// COMMENT EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { attraction_id: req.params.id, comment: foundComment });
        }
    });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/attractions/" + req.params.id);
        }
    });
});

// COMMENT DESTROY 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted Successfuly!");
            res.redirect("/attractions/" + req.params.id);
        }
    });
});

module.exports = router;