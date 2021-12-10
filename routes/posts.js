const expres = require('express');
const router = expres.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');
router.post('/create',passport.checkAuthentication,postsController.create);
router.get('/destroy/:id',passport.checkAuthentication,postsController.destroy);

module.exports = router; 