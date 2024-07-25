const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

const imagekit = require('../libs/imagekit');

module.exports = {
	postEvent: async (req, res, next) => {
		try {
			let { name, start_date, end_date, location } = req.body;

			if (!name || !start_date || !end_date || !location || !req.file) {
				return res.status(400).json({
					status: false,
					message:
						'name, start_date, end_date, location, and image required',
					data: null
				});
			}

			let startDate = new Date(start_date);
			let endDate = new Date(end_date);

			// if (startDate > endDate) {
			// 	return res.status(400).json({
			// 		status: false,
			// 		message: 'start_date cannot be greater than end_date',
			// 		data: null
			// 	});
			// }

			let strFile = req.file.buffer.toString('base64');

			let { url } = await imagekit.upload({
				fileName: Date.now() + path.extname(req.file.originalname),
				file: strFile
			});

			let event = await prisma.event.create({
				data: {
					name,
					startDate,
					endDate,
					location,
					imageUrl: url
				}
			});

			return res.status(201).json({
				status: true,
				message: 'event created',
				data: event
			});
		} catch (error) {
			next(error);
		}
	},

	getAllEvents: async (req, res, next) => {
		try {
			let results = await prisma.event.findMany();

			if (results.length === 0) {
				return res.status(404).json({
					status: false,
					message: 'events not found',
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

	getEventsByPaginationNSearch: async (req, res, next) => {
		try {
			let { limit, page, search } = req.query;

			let pageNumber = Number(page) || 1;
			let limitNumber = Number(limit) || 8;

			let offset = (pageNumber - 1) * limitNumber;

			let results = await prisma.event.findMany({
				take: limitNumber,
				skip: offset,
				where: { name: { contains: search, mode: 'insensitive' } }
			});

			if (results.length === 0) {
				return res.status(404).json({
					status: false,
					message: 'events not found',
					data: null
				});
			}

			let total = await prisma.event.count({
				where: { name: { contains: search, mode: 'insensitive' } }
			});

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

	getEvent: async (req, res, next) => {
		try {
			let id = Number(req.params.id);

			let result = await prisma.event.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'event not found',
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

	updateEvent: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let { name, start_date, end_date, location } = req.body;

			let result = await prisma.event.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'event not found',
					data: null
				});
			}

			if (name) {
				result.name = name;
			}

			if (location) {
				result.location = location;
			}

			if (start_date) {
				result.startDate = new Date(start_date);
			}

			if (end_date) {
				result.startDate = new Date(end_date);
			}

			// if (result.startDate > result.endDate) {
			// 	return res.status(400).json({
			// 		status: false,
			// 		message: 'end_date must be greater than start_date',
			// 		data: null
			// 	});
			// }

			if (req.file) {
				let strFile = req.file.buffer.toString('base64');

				let { url } = await imagekit.upload({
					fileName: Date.now() + path.extname(req.file.originalname),
					file: strFile
				});

				result.imageUrl = url;
			}

			let event = await prisma.event.update({
				where: { id },
				data: {
					name: result.name,
					startDate: result.startDate,
					endDate: result.endDate,
					location: result.location,
					imageUrl: result.imageUrl
				}
			});

			return res.status(201).json({
				status: true,
				message: 'event updated',
				data: event
			});
		} catch (error) {
			next(error);
		}
	},

	deleteEvent: async (req, res, next) => {
		try {
			let id = Number(req.params.id);

			let result = await prisma.event.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'event not found',
					data: null
				});
			}

			let event = await prisma.event.delete({
				where: { id }
			});

			return res.status(200).json({
				status: true,
				message: 'event deleted',
				data: event
			});
		} catch (error) {
			next(error);
		}
	}
};
