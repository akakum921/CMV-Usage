const mongoose = require('mongoose');
const env = require('./environment');
//connection to my database
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;


//console.error displays my console.log as an error
db.on('error', console.error.bind(console,'Error connecting to MongoDB'));

db.once('open', function(){

    console.log('Connected to Database :: MongoDB');
});

module.exports = db;