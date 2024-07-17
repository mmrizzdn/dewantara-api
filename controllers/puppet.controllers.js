const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

const imagekit = require('../libs/imagekit');

module.exports = {
	addPuppet: async (req, res, next) => {
		try {
			let { name, description } = req.body;

			if (!name || !description || !req.file) {
				return res.status(400).json({
					status: false,
					message: 'name, description, and image required',
					data: null
				});
			}

			let strFile = req.file.buffer.toString('base64');

			let { url } = await imagekit.upload({
				fileName: Date.now() + path.extname(req.file.originalname),
				file: strFile
			});

			let puppet = await prisma.puppet.create({
				data: {
					name,
					description,
					imageUrl: url
				}
			});

			return res.status(201).json({
				status: true,
				message: 'puppet created',
				data: puppet
			});
		} catch (error) {
			next(error);
		}
	},

	getAllPuppets: async (req, res, next) => {
		try {
			let results = await prisma.puppet.findMany();

			if (results.length === 0) {
				return res.status(404).json({
					status: false,
					message: 'puppets not found',
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

	getPuppetsByPaginationNSearch: async (req, res, next) => {
		try {
			let { limit, page, search } = req.query;

			let pageNumber = Number(page) || 1;
			let limitNumber = Number(limit) || 16;

			let offset = (pageNumber - 1) * limitNumber;

			let where = {};

			if (search) {
				where = {
					OR: [
						{
							name: {
								contains: search,
								mode: 'insensitive'
							}
						},
						{
							description: {
								contains: search,
								mode: 'insensitive'
							}
						}
					]
				};
			}

			let results = await prisma.puppet.findMany({
				take: limitNumber,
				skip: offset,
				where
			});

			if (results.length === 0) {
				return res.status(404).json({
					status: false,
					message: 'puppets not found',
					data: null
				});
			}

			let total = await prisma.puppet.count({ where });

			return res.status(200).json({
				status: true,
				message: 'OK',
				data: results,
				meta: {
					page: pageNumber,
					limit: limitNumber,
					totalPages: Math.ceil(total / limitNumber),
					totalResults: total
				}
			});
		} catch (error) {
			next(error);
		}
	},

	getPuppet: async (req, res, next) => {
		try {
			let id = Number(req.params.id);

			let result = await prisma.puppet.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'puppet not found',
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

	updatePuppet: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let { name, description } = req.body;

			let result = await prisma.puppet.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'puppet not found',
					data: null
				});
			}

			if (name) {
				result.name = name;
			}

			if (description) {
				result.description = description;
			}

			if (req.file) {
				let strFile = req.file.buffer.toString('base64');

				let { url } = await imagekit.upload({
					fileName: Date.now() + path.extname(req.file.originalname),
					file: strFile
				});

				result.imageUrl = url;
			}

			let updatedPuppet = await prisma.puppet.update({
				where: { id },
				data: {
					name: result.name,
					description: result.description,
					imageUrl: result.imageUrl
				}
			});

			return res.status(201).json({
				status: true,
				message: 'puppet updated',
				data: updatedPuppet
			});
		} catch (error) {
			next(error);
		}
	},

	deletePuppet: async (req, res, next) => {
		try {
			let id = Number(req.params.id);

			let result = await prisma.puppet.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'puppet not found',
					data: null
				});
			}

			let puppet = await prisma.puppet.delete({
				where: { id }
			});

			return res.status(200).json({
				status: true,
				message: 'puppet deleted',
				data: puppet
			});
		} catch (error) {
			next(error);
		}
	}
};
