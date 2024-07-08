const multer = require('multer');

const generateFileFilter = (mimetypes) => {
	return (req, file, callback) => {
		if (mimetypes.includes(file.mimetype)) {
			callback(null, true);
		} else {
			let err = new Error(`only ${mimetypes} can be uploaded!`);
			callback(err, false);
		}
	};
};

module.exports = {
	image: multer({
		fileFilter: generateFileFilter([
			'image/png',
			'image/jpg',
			'image/jpeg'
		]),

		onError: (error, next) => {
			next(error);
		}
	})
};
