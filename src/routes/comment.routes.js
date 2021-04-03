const {Router} = require('express');
const CommentController = require('../controller/commentController');
const { isLoggedIn } = require('../libs/functions');

const router = Router();

router.post('/:id/add-comment', isLoggedIn, CommentController.addComment);
router.delete('/:id/delete', isLoggedIn, CommentController.deleteComment);

module.exports = router;