const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");

module.exports.home = async function (req, res) {
  try {
    // change:: populate the user of each post and likes of each post and comment
    let posts = await Post.find({})
      .sort('-createdAT')
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: "likes"
        }
      }).populate('comments').populate('likes');
    let users = await User.find({});
    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
      console.log('Error',err);
      return;
  }
}

//module.exports.actionName = function(req,res){}


// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()
