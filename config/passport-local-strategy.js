const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
//require user
//authentication using passport 
passport.use(new LocalStrategy({
    usernameField: 'email',
    },

    function(email,password,done){
        //find the user and establish the identity
        User.findOne({email: email}, function(err,user){
            if(err){
                console.log('Error in finding the user ---> Passport');
                return done(err);    
            }  
            if(!user || user.password != password){
                console.log('Invalid Username or Password');
                return done(err,false);
            }
            
            return done(null,user);
        });
    }

));


//Serializing the user to decide which key is to be kept in the cookies
//to set the user's id in the coookie
passport.serializeUser(function(user,done){
    //this will encrypt the id and store it in the session cookie
    //encryption is done by the express session middleware in index.js
    done(null,user.id);
});



//Deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
     User.findById(id,function(err,user){
           if(err){
           console.log('Error in finding the user ---> Passport');
           return done(err);    
       }  
       return done(null,user);

     });
});

//check if the user is authenticated
passport.checkAuthentication = function(req,res,next){

    //if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }
    //if the user not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){

    if (req.isAuthenticated()){
        //req.user contains the current signed in user from the cookie and we are just sending this to the locals for the views
        res.locals.user = req.user
    }
    next();
}


module.exports = passport;