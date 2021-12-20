const User = require('../../../models/user');
const jwt = require('jsonwebtoken');


module.exports.createSession = async function(req,res){

    try {

        let user = await User.findOne({email: req.body.email});
        
        //if user not found
        if(!user || user.password != req.body.password) {
            return res.json(422, {
                message: "Invalid Username or Password"  
            });
        }
        return res.json(200, {
            message: "Signed in Successfully! Here is your token, pls keep it safe",  
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '10000'})
            }        
        });

    } catch (err) {
        return res.json(500, {
        message: "Internal Server Error!"
      });
    }
}