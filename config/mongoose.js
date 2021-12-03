const mongoose = require('mongoose');

//connection to my database
mongoose.connect('mongodb://localhost/codeial_development');

const db = mongoose.connection;


//console.error displays my console.log as an error
db.on('error', console.error.bind(console,'Error connecting to MongoDB'));

db.once('open', function(){

    console.log('Connected to Database :: MongoDB');
});

module.exports = db;