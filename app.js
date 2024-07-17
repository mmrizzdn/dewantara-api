var express = require('express');
var logger = require('morgan');

const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'api-docs.yaml');
const file = fs.readFileSync(filePath, 'utf8');
const swaggerDocument = YAML.parse(file);

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/api/v1', indexRouter);
app.use('/api/v1/auth', adminRouter);

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
