const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users_controller');


// const postController = require('../controllers/post_controller');
// router.get('/image',postController.image);

router.get('/profile',usersController.profile);
module.exports = router;