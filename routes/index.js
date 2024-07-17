var express = require('express');
var router = express.Router();

const { image } = require('../libs/multer');
const { restrict } = require('../middlewares/restrict');

const {
	addPuppet,
	getAllPuppets,
	getPuppetsByPaginationNSearch,
	getPuppet,
	updatePuppet,
	deletePuppet
} = require('../controllers/puppet.controllers');

const {
	postArticle,
	getAllArticles,
	getArticlesByPaginationNSearch,
	getArticle,
	updateArticle,
	deleteArticle
} = require('../controllers/article.controllers');

const {
	postEvent,
	getAllEvents,
	getEventsByPaginationNSearch,
	getEvent,
	updateEvent,
	deleteEvent
} = require('../controllers/event.controllers');

const {
	addMuseum,
	getAllMuseums,
	getMuseumsByPaginationNSearch,
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
router.post('/puppet', restrict, image.single('file'), addPuppet);
router.get('/puppets/all', getAllPuppets);
router.get('/puppets', getPuppetsByPaginationNSearch);
router.get('/puppets/:id', getPuppet);
router.put('/puppets/:id', restrict, image.single('file'), updatePuppet);
router.delete('/puppets/:id', restrict, deletePuppet);

// articles
router.post('/article', restrict, image.single('file'), postArticle);
router.get('/articles/all', getAllArticles);
router.get('/articles', getArticlesByPaginationNSearch);
router.get('/articles/:id', getArticle);
router.put('/articles/:id', restrict, image.single('file'), updateArticle);
router.delete('/articles/:id', restrict, deleteArticle);

// events
router.post('/event', restrict, image.single('file'), postEvent);
router.get('/events/all', getAllEvents);
router.get('/events', getEventsByPaginationNSearch);
router.get('/events/:id', getEvent);
router.put('/events/:id', restrict, image.single('file'), updateEvent);
router.delete('/events/:id', deleteEvent);

// museums
router.post('/museum', restrict, image.single('file'), addMuseum);
router.get('/museums/all', getAllMuseums);
router.get('/museums', getMuseumsByPaginationNSearch);
router.get('/museums/:id', getMuseum);
router.put('/museums/:id', restrict, image.single('file'), updateMuseum);
router.delete('/museums/:id', restrict, deleteMuseum);

// museums - operational hours
router.post('/museums/operational_hours', restrict, addOperationalHour);
router.put('/museums/operational_hours/:id', restrict, updateOperationalHour);
router.delete(
	'/museums/operational_hours/:id',
	restrict,
	deleteOperationalHour
);

// museums - tickets
router.post('/museums/tickets', restrict, addTicket);
router.put('/museums/tickets/:id', restrict, updateTicket);
router.delete('/museums/tickets/:id', restrict, deleteTicket);

// museums - collections
router.post(
	'/museums/collections',
	restrict,
	image.array('file'),
	postCollections
);
router.put(
	'/museums/collections/:id',
	restrict,
	image.single('file'),
	updateCollection
);
router.delete('/museums/collections/:id', restrict, deleteCollection);

module.exports = router;
