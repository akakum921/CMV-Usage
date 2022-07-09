const expres = require('express');
const router = expres.Router();
const likesController = require('../controllers/likes_controller');

router.post('/toggle',likesController.toggleLike);
module.exports = router; 