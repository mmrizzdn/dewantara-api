var express = require("express");
var router = express.Router();

const {
	postArticle,
	getArticles,
	getAnArticle,
	updateArticle,
	deleteArticle,
} = require("../../controllers/v1/article.controllers");
const { postEvent, getEvents } = require("../../controllers/v1/event.controllers");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// articles
router.post("/articles", postArticle);
router.get("/articles", getArticles);
router.get("/articles/:id", getAnArticle);
router.put("/articles/:id", updateArticle);
router.delete("/articles/:id", deleteArticle);

// events
router.post("/events", postEvent);
router.get("/events", getEvents);

module.exports = router;
