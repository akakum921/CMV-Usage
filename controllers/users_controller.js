const User = require('../models/user');

module.exports.profile = function(req,res){
    return res.render('post',{
        title: 'Post'
    });
}


//render the sign up page
module.exports.signUp = function(req,res){
  
     return res.render('user_sign_up',{
         title: "Codeial | Sign Up"
     })

}


//render the sign in page
module.exports.signIn = function(req,res){
  
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create = function(req,res){
    
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('Error in finding user in signing up');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
               if(err){
                   console.log('Error in creating user while signing up');
                   return;
               }

               //after creating user redirecting it to the sign in page
               return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('/users/sign-in');
        }
    })
    
}


//to sign in and create a seesion for the user
module.exports.createSession = function(req,res){
    
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}