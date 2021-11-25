const expres = require('express');
const router = expres.Router();

const postController = require('../controllers/post_controller');

router.get('/image',postController.image);

module.exports = router;