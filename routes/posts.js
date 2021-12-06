const expres = require('express');
const router = expres.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');
router.post('/create',passport.checkAuthentication,postsController.create);

module.exports = router; 