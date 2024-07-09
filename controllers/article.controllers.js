const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { formatDistanceToNow } = require('date-fns');
const path = require('path');

const imagekit = require('../libs/imagekit');

module.exports = {
	postArticle: async (req, res, next) => {
		try {
			let { title, content } = req.body;

			if (!title || !content || !req.file) {
				return res.status(400).json({
					status: false,
					message: 'title, content, and image required',
					data: null
				});
			}

			let strFile = req.file.buffer.toString('base64');

			let { url } = await imagekit.upload({
				fileName: Date.now() + path.extname(req.file.originalname),
				file: strFile
			});

			let article = await prisma.article.create({
				data: {
					title,
					content,
					imageUrl: url
				}
			});

			return res.status(201).json({
				status: true,
				message: 'article created',
				data: article
			});
		} catch (error) {
			next(error);
		}
	},

	getAllArticles: async (req, res, next) => {
		try {
			let results = await prisma.article.findMany();

			if (results.length === 0) {
				return res.status(404).json({
					status: false,
					message: 'articles not found',
					data: null
				});
			}

			let articles = results.map((article) => {
				return {
					...article,
					timeAgo: formatDistanceToNow(new Date(article.createdAt), {
						addSuffix: true
					})
				};
			});

			return res.status(200).json({
				status: true,
				message: 'OK',
				data: articles
			});
		} catch (error) {
			next(error);
		}
	},

	getArticle: async (req, res, next) => {
		try {
			let id = Number(req.params.id);

			let result = await prisma.article.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'article not found',
					data: null
				});
			}

			let article = {
				...result,
				timeAgo: formatDistanceToNow(new Date(result.createdAt), {
					addSuffix: true
				})
			};

			return res.status(200).json({
				status: true,
				message: 'OK',
				data: article
			});
		} catch (error) {
			next(error);
		}
	},

	updateArticle: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let { title, content } = req.body;

			let result = await prisma.article.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'article not found',
					data: null
				});
			}

			if (req.file) {
				let strFile = req.file.buffer.toString('base64');

				let { url } = await imagekit.upload({
					fileName: Date.now() + path.extname(req.file.originalname),
					file: strFile
				});

				result.imageUrl = url;
			}

			let article = { title, content, imageUrl: result.imageUrl };

			let updatedArticle = await prisma.article.update({
				where: { id },
				data: article
			});

			return res.status(201).json({
				status: true,
				message: 'article updated',
				data: updatedArticle
			});
		} catch (error) {
			next(error);
		}
	},

	deleteArticle: async (req, res, next) => {
		try {
			let id = Number(req.params.id);

			let result = await prisma.article.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'article not found',
					data: null
				});
			}

			let article = await prisma.article.delete({
				where: { id }
			});

			return res.status(200).json({
				status: true,
				message: 'article deleted',
				data: article
			});
		} catch (error) {
			next(error);
		}
	}
};
