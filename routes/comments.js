const expres = require('express');
const router = expres.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');
router.post('/create',passport.checkAuthentication,commentsController.create);

module.exports = router; 