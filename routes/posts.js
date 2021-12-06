const expres = require('express');
const router = expres.Router();

const postsController = require('../controllers/posts_controller');

router.post('/create',postsController.create);

module.exports = router;