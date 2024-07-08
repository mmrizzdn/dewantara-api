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

			if (req.file) {
				let strFile = req.file.buffer.toString('base64');

				let { url } = await imagekit.upload({
					fileName: Date.now() + path.extname(req.file.originalname),
					file: strFile
				});

				result.imageUrl = url;
			}

			let puppet = { name, description, imageUrl: result.imageUrl };

			let updatedPuppet = await prisma.puppet.update({
				where: { id },
				data: puppet
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
