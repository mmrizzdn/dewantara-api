const ImageKit = require("imagekit");

require("dotenv").config;

const { PUBLIC_KEY, PRIVATE_KEY, URL_ENDPOINT } = process.env;

module.exports = new ImageKit({
	publicKey: PUBLIC_KEY,
	privateKey: PRIVATE_KEY,
	urlEndpoint: URL_ENDPOINT,
});
