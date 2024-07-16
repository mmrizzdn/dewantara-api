var express = require('express');
var router = express.Router();

const { image } = require('../libs/multer');
const { restrict } = require('../middlewares/restrict');

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
	addOperationalHour,
	updateOperationalHour,
	deleteOperationalHour,
	addTicket,
	updateTicket,
	deleteTicket,
	postCollections,
	updateCollection,
	deleteCollection
} = require('../controllers/museum.controllers');

// puppets
router.post('/puppets', restrict, image.single('file'), addPuppet);
router.get('/puppets', getAllPuppets);
router.get('/puppets/:id', getPuppet);
router.put('/puppets/:id', restrict, image.single('file'), updatePuppet);
router.delete('/puppets/:id', restrict, deletePuppet);

// articles
router.post('/articles', restrict, image.single('file'), postArticle);
router.get('/articles', getAllArticles);
router.get('/articles/:id', getArticle);
router.put('/articles/:id', restrict, image.single('file'), updateArticle);
router.delete('/articles/:id', restrict, deleteArticle);

// events
router.post('/events', restrict, image.single('file'), postEvent);
router.get('/events', getAllEvents);
router.get('/events/:id', getEvent);
router.put('/events/:id', restrict, image.single('file'), updateEvent);
router.delete('/events/:id', deleteEvent);

// museums
router.post('/museums', restrict, image.single('file'), addMuseum);
router.get('/museums', getAllMuseums);
router.get('/museums/:id', getMuseum);
router.put('/museums/:id', restrict, image.single('file'), updateMuseum);
router.delete('/museums/:id', restrict, deleteMuseum);

// museums - operational hours
router.post('/operational_hours', restrict, addOperationalHour);
router.put('/operational_hours/:id', restrict, updateOperationalHour);
router.delete('/operational_hours/:id', restrict, deleteOperationalHour);

// museums - tickets
router.post('/tickets', restrict, addTicket);
router.put('/tickets/:id', restrict, updateTicket);
router.delete('/tickets/:id', restrict, deleteTicket);

// museums - collections
router.post('/collections', restrict, image.array('file', 5), postCollections);
router.put('/collections/:id', restrict, image.single('file'), updateCollection);
router.delete('/collections/:id', restrict, deleteCollection);

module.exports = router;
