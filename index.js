const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);
const port = 8004;
//set up the express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');
//imported the mongoose database file
const db = require('./config/mongoose');
//Used for session cookie & authentication password
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
// google passport strategy
const passportGoggle = require('./config/passport-google-oauth2-strategy');

//to store the session ----npm install connect-mongo
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
//library for flash messages
const flash = require('connect-flash');
const customMware = require('./config/middleware');
// chat socket server

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(3000);
console.log('Chat server is listening on port 3000');

const path = require('path');

if (env.name == 'development') {
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
     }));
}


app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cookieParser());
app.use(express.static(env.asset_path));

//make the uploads path availabe to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

//extract style and script from sub pages into the layout.ejs page
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//this middleware will encrypt the  id 
//To store the logged in user’s information in an encrypted format in the cookie 
//mongo store is used to store the session coookie in the db
app.use(session({
    name: 'codeial',
    //TODO chnage the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: new MongoStore(
        {
           //permanently store the current user session
           mongoUrl: `mongodb://localhost/${env.db}`,
        //    mongooseConnection: db,
           autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup is ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){

    if(err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});