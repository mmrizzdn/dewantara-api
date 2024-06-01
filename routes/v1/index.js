var express = require("express");
var router = express.Router();

const { image } = require("../../libs/multer");

const {
	postArticle,
	getArticles,
	getAnArticle,
	updateArticle,
	deleteArticle,
} = require("../../controllers/v1/article.controllers");

const {
	postEvent,
	getEvents,
	getEvent,
	updateEvent,
	deleteEvent,
} = require("../../controllers/v1/event.controllers");

// articles
router.post("/articles", postArticle);
router.get("/articles", getArticles);
router.get("/articles/:id", getAnArticle);
router.put("/articles/:id", updateArticle);
router.delete("/articles/:id", deleteArticle);

// events
router.post("/events", image.single("file"), postEvent);
router.get("/events", getEvents);
router.get("/events/:id", getEvent);
router.put("/events/:id", image.single("file"), updateEvent);
router.delete("/events/:id", deleteEvent);

module.exports = router;
