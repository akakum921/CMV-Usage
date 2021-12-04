const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;

//set up the express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');
app.use(express.static('./assets'));

//imported the mongoose database file
const db = require('./config/mongoose');

//Used for session cookie & authentication password
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');



app.use(express.urlencoded());
app.use(cookieParser());


app.use(expressLayouts);

//extract style and script from sub pages into the layout.ejs page
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//this middleware will encrypt the  id 
//To store the logged in user’s information in an encrypted format in the cookie 
app.use(session({
    name: 'codeial',
    //TODO chnage the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    }

}));

app.use(passport.initialize());
app.use(passport.session());

//use express router
app.use('/',require('./routes'));



app.listen(port,function(err){

    if(err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});