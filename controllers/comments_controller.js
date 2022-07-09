const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      post.save();

      // Similar for comments to fetch the user's id!
      comment = await comment.populate('user','name email');
      // commentsMailer.newComment(comment);
      let job = queue.create('emails', comment).save(function(err){
           if(err) {
             console.log('Error in creating a queue',err);
              return; 
            }

           console.log('Job enqueued', job.id);

      });
      if (req.xhr) { 

        return res.status(200).json({
          data: {
            comment: comment
          },
          message: "Comment created!"
        });
      }

      req.flash("success", "Comment published!");
      return res.redirect("/");
    }
  } catch (err) {
    // console.log("error in creating the comment");
    req.flash("error", err);
    return;
  }

}

//to delete a comment
module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();

      let post = Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id }});

      //delete the associated likes for this comment
      await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


      // send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment deleted",
        });
      }

      req.flash("success", "Comment deleted!");
      
      return res.redirect("back");
    } else {
      req.flash("error", "Unauthorized");
      return res.redirect("back");
    }
  } catch (err) {
    // console.log("Error in deleting the comment", err);
    req.flash("error", err);
    return;
  }
}
