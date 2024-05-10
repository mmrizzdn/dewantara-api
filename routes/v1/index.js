var express = require('express');
var router = express.Router();

const { postArticle, getArticles, getAnArticle, updateArticle, deleteArticle } = require('../../controllers/v1/article.controllers');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/articles', postArticle);
router.get('/articles', getArticles);
router.get('/articles/:id', getAnArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

module.exports = router;
