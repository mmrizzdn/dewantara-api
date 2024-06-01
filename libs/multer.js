const multer = require("multer");

const generateFileFilter = (mimetypes) => {
	return (req, file, callback) => {
		if (mimetypes.includes(file.mimetype)) {
			callback(null, true);
		} else {
			let err = new Error(`only ${mimetypes} can be uploaded!`);
            callback(err, false)
		}
	};
};

const maxSize = 5 * 1024 * 1024;

module.exports = {
	image: multer({
		fileFilter: generateFileFilter([
			"image/png",
			"image/jpg",
			"image/jpeg",
		]),

		limits: { fileSize: maxSize },

		onError: (error, next) => {
			next(error);
		},
	}),
};
