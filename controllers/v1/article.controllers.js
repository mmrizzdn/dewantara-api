const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
	postArticle: async (req, res, next) => {
		try {
			let { title, content } = req.body;

			if (!title || !content) {
				return res.status(400).json({
					status: false,
					message: 'title and content are required',
					data: null
				});
			}

			let article = await prisma.article.create({
				data: {
					title,
					content
				}
			});

			return res.status(201).json({
				status: true,
				message: 'Created',
				data: article
			});
		} catch (error) {
			next(error);
		}
	},

	getArticles: async (req, res, next) => {
		try {
			let results = await prisma.article.findMany();

			if (results.length === 0) {
				return res.status(404).json({
					status: false,
					message: 'articles not found',
					data: null
				});
			}

			return res.status(200).json({
				status: true,
				message: 'OK',
				data: results
			});
		} catch (error) {
			next(error);
		}
	},

	getAnArticle: async (req, res, next) => {
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

			return res.status(200).json({
				status: true,
				message: 'OK',
				data: result
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

			let newArticle = await prisma.article.update({
				where: { id },
				data: {
					title,
					content
				}
			});

			return res.status(201).json({
				status: true,
				message: 'Created',
				data: newArticle
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
				message: 'OK',
				data: article
			});
		} catch (error) {
			next(error);
		}
	}
};
