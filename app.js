var express = require('express');
var logger = require('morgan');

var indexRouter = require('./routes/v1/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/api/v1', indexRouter);
// app.use('/users', usersRouter);

// home page
app.get('/', (req, res) => {
	return res.status(200).json({
		status: true,
		message: 'welcome to dewantara api!',
		data: null
	});
});

// catch 500 and forward to error handler
app.use((err, req, res, next) => {
	console.log(err);

	return res.status(500).json({
		status: false,
		message: err.message,
		data: null
	});
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	return res.status(404).json({
		status: false,
		message: `are you lost? ${req.method} ${req.url} is not registered`,
		data: null
	});
});

module.exports = app;
