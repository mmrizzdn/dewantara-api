var express = require('express');
var router = express.Router();

const { image } = require('../libs/multer');

const {
	addPuppet,
	getAllPuppets,
	getPuppet,
	updatePuppet,
	deletePuppet
} = require('../controllers/puppet.controllers');

const {
	postArticle,
	getAllArticles,
	getArticle,
	updateArticle,
	deleteArticle
} = require('../controllers/article.controllers');

const {
	postEvent,
	getAllEvents,
	getEvent,
	updateEvent,
	deleteEvent
} = require('../controllers/event.controllers');

const {
	addMuseum,
	getAllMuseums,
	getMuseum,
	updateMuseum,
	deleteMuseum,
	addOperatingHour,
	updateOperatingHour,
	deleteOperatingHour,
	addTicket,
	updateTicket,
	deleteTicket,
	postCollections,
	updateCollection,
	deleteCollection
} = require('../controllers/museum.controllers');

// puppets
router.post('/puppets', image.single('file'), addPuppet);
router.get('/puppets', getAllPuppets);
router.get('/puppets/:id', getPuppet);
router.put('/puppets/:id', image.single('file'), updatePuppet);
router.delete('/puppets/:id', deletePuppet);

// articles
router.post('/articles', image.single('file'), postArticle);
router.get('/articles', getAllArticles);
router.get('/articles/:id', getArticle);
router.put('/articles/:id', image.single('file'), updateArticle);
router.delete('/articles/:id', deleteArticle);

// events
router.post('/events', image.single('file'), postEvent);
router.get('/events', getAllEvents);
router.get('/events/:id', getEvent);
router.put('/events/:id', image.single('file'), updateEvent);
router.delete('/events/:id', deleteEvent);

// museums
router.post('/museums', image.single('file'), addMuseum);
router.get('/museums', getAllMuseums);
router.get('/museums/:id', getMuseum);
router.put('/museums/:id', image.single('file'), updateMuseum);
router.delete('/museums/:id', deleteMuseum);

// museums - operating hours
router.post('/operating_hours', addOperatingHour);
router.put('/operating_hours/:id', updateOperatingHour);
router.delete('/operating_hours/:id', deleteOperatingHour);

// museums - tickets
router.post('/tickets', addTicket);
router.put('/tickets/:id', updateTicket);
router.delete('/tickets/:id', deleteTicket);

// museums - collections
router.post('/collections', image.array('file', 5), postCollections);
router.put('/collections/:id', image.single('file'), updateCollection);
router.delete('/collections/:id', deleteCollection);

module.exports = router;
