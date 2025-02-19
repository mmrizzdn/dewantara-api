const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

const imagekit = require('../libs/imagekit');

module.exports = {
	addMuseum: async (req, res, next) => {
		try {
			let { name, about, address, regency, province, mapsUrl } = req.body;

			if (
				!name ||
				!about ||
				!address ||
				!regency ||
				!province ||
				!mapsUrl ||
				!req.file
			) {
				return res.status(400).json({
					status: false,
					message:
						'name, about, address, regency, province, and image required',
					data: null
				});
			}

			let strFile = req.file.buffer.toString('base64');

			let { url } = await imagekit.upload({
				fileName: Date.now() + path.extname(req.file.originalname),
				file: strFile
			});

			let museum = await prisma.museum.create({
				data: {
					name,
					about,
					imageUrl: url,
					Location: {
						create: {
							address,
							regency,
							province,
							mapsUrl
						}
					}
				}
			});

			return res.status(201).json({
				status: true,
				message: 'museum created',
				data: museum
			});
		} catch (error) {
			next(error);
		}
	},

	getAllMuseums: async (req, res, next) => {
		try {
			let results = await prisma.museum.findMany({
				include: {
					Location: true,
					OperationalHour: true,
					Ticket: true,
					Collection: true
				}
			});

			if (results.length === 0) {
				return res.status(404).json({
					status: false,
					message: 'museums not found',
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

	getMuseumsByPaginationNSearch: async (req, res, next) => {
		try {
			let { page, limit, search } = req.query;

			let pageNumber = Number(page) || 1;
			let limitNumber = Number(limit) || 6;

			let offset = (pageNumber - 1) * limitNumber;

			let results = await prisma.museum.findMany({
				take: limitNumber,
				skip: offset,
				where: { name: { contains: search, mode: 'insensitive' } },
				include: {
					Location: true,
					OperationalHour: true,
					Ticket: true,
					Collection: true
				}
			});

			if (results.length === 0) {
				return res.status(404).json({
					status: false,
					message: 'museums not found',
					data: null
				});
			}

			let total = await prisma.museum.count({
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

	getMuseum: async (req, res, next) => {
		try {
			let id = Number(req.params.id);

			let result = await prisma.museum.findUnique({
				where: { id },
				include: {
					Location: true,
					OperationalHour: true,
					Ticket: true,
					Collection: true
				}
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
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

	updateMuseum: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let { name, about, address, regency, province, mapsUrl } = req.body;

			let result = await prisma.museum.findUnique({
				where: { id }
			});

			let location = await prisma.location.findFirst({
				where: { museumId: id }
			});

			if (!result || !location) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			if (name) {
				result.name = name;
			}

			if (about) {
				result.about = about;
			}

			if (address) {
				location.address = address;
			}

			if (regency) {
				location.regency = regency;
			}

			if (province) {
				location.province = province;
			}

			if (mapsUrl) {
				location.mapsUrl = mapsUrl;
			}

			if (req.file) {
				let strFile = req.file.buffer.toString('base64');

				let { url } = await imagekit.upload({
					fileName: Date.now() + path.extname(req.file.originalname),
					file: strFile
				});

				result.imageUrl = url;
			}

			let museum = await prisma.museum.update({
				where: { id },
				data: {
					name: result.name,
					about: result.about,
					imageUrl: result.imageUrl
				}
			});

			let updatedLocation = await prisma.location.update({
				where: { id: location.id },
				data: {
					address: location.address,
					regency: location.regency,
					province: location.province,
					mapsUrl: location.mapsUrl
				}
			});

			return res.status(201).json({
				status: true,
				message: 'museum updated',
				data: {
					museum,
					updatedLocation
				}
			});
		} catch (error) {
			next(error);
		}
	},

	deleteMuseum: async (req, res, next) => {
		try {
			let id = Number(req.params.id);

			let result = await prisma.museum.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			await prisma.location.deleteMany({
				where: { museumId: id }
			});

			await prisma.operationalHour.deleteMany({
				where: { museumId: id }
			});

			await prisma.ticket.deleteMany({
				where: { museumId: id }
			});

			await prisma.collection.deleteMany({
				where: { museumId: id }
			});

			let museum = await prisma.museum.delete({
				where: { id }
			});

			return res.status(200).json({
				status: true,
				message: 'museum deleted',
				data: museum
			});
		} catch (error) {
			next(error);
		}
	},

	addOperationalHour: async (req, res, next) => {
		try {
			let museumId = Number(req.query.museum_id);

			let result = await prisma.museum.findUnique({
				where: { id: museumId }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			let {
				is_sunday,
				is_monday,
				is_tuesday,
				is_wednesday,
				is_thursday,
				is_friday,
				is_saturday,
				is_national_holiday,
				start_time,
				end_time,
				timezone
			} = req.body;

			if (
				typeof is_sunday === 'undefined' ||
				typeof is_monday === 'undefined' ||
				typeof is_tuesday === 'undefined' ||
				typeof is_wednesday === 'undefined' ||
				typeof is_thursday === 'undefined' ||
				typeof is_friday === 'undefined' ||
				typeof is_saturday === 'undefined' ||
				typeof is_national_holiday === 'undefined' ||
				!start_time ||
				!end_time ||
				!timezone
			) {
				return res.status(400).json({
					status: false,
					message: 'days, start_time, end_time, timezone required',
					data: null
				});
			}

			let operationalHour = await prisma.operationalHour.create({
				data: {
					isSunday: is_sunday,
					isMonday: is_monday,
					isTuesday: is_tuesday,
					isWednesday: is_wednesday,
					isThursday: is_thursday,
					isFriday: is_friday,
					isSaturday: is_saturday,
					isNationalHoliday: is_national_holiday,
					startTime: start_time,
					endTime: end_time,
					timezone,
					museumId
				}
			});

			return res.status(201).json({
				status: true,
				message: 'operational hour created',
				data: operationalHour
			});
		} catch (error) {
			next(error);
		}
	},

	updateOperationalHour: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let museumId = Number(req.query.museum_id);

			let result = await prisma.operationalHour.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'operational hour not found',
					data: null
				});
			}

			let museum = await prisma.museum.findUnique({
				where: { id: museumId }
			});

			if (!museum) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			if (result.museumId !== museumId) {
				return res.status(404).json({
					status: false,
					message:
						'this operational hour does not belong to this museum',
					data: null
				});
			}

			let {
				is_sunday,
				is_monday,
				is_tuesday,
				is_wednesday,
				is_thursday,
				is_friday,
				is_saturday,
				is_national_holiday,
				start_time,
				end_time,
				timezone
			} = req.body;

			if (is_sunday) {
				result.isSunday = is_sunday;
			}

			if (is_monday) {
				result.isMonday = is_monday;
			}

			if (is_tuesday) {
				result.isTuesday = is_tuesday;
			}

			if (is_wednesday) {
				result.isWednesday = is_wednesday;
			}

			if (is_thursday) {
				result.isThursday = is_thursday;
			}

			if (is_friday) {
				result.isFriday = is_friday;
			}

			if (is_saturday) {
				result.isSaturday = is_saturday;
			}

			if (is_national_holiday) {
				result.isNationalHoliday = is_national_holiday;
			}

			if (start_time) {
				result.startTime = start_time;
			}

			if (end_time) {
				result.endTime = end_time;
			}

			if (timezone) {
				result.timezone = timezone;
			}

			operationalHour = await prisma.operationalHour.update({
				where: { id, museumId },
				data: {
					isSunday: result.isSunday,
					isMonday: result.isMonday,
					isTuesday: result.isTuesday,
					isWednesday: result.isWednesday,
					isThursday: result.isThursday,
					isFriday: result.isFriday,
					isSaturday: result.isSaturday,
					isNationalHoliday: result.isNationalHoliday,
					startTime: result.startTime,
					endTime: result.endTime,
					timezone: result.timezone
				}
			});

			return res.status(200).json({
				status: true,
				message: 'operational hour updated',
				data: operationalHour
			});
		} catch (error) {
			next(error);
		}
	},

	deleteOperationalHour: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let museumId = Number(req.query.museum_id);

			let result = await prisma.operationalHour.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'operational hour not found',
					data: null
				});
			}

			let museum = await prisma.museum.findUnique({
				where: { id: museumId }
			});

			if (!museum) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			if (result.museumId !== museumId) {
				return res.status(404).json({
					status: false,
					message:
						'this operational hour does not belong to this museum',
					data: null
				});
			}

			let operationalHour = await prisma.operationalHour.delete({
				where: { id, museumId }
			});

			return res.status(200).json({
				status: true,
				message: 'operational hour deleted',
				data: operationalHour
			});
		} catch (error) {
			next(error);
		}
	},

	addTicket: async (req, res, next) => {
		try {
			let museumId = Number(req.query.museum_id);

			let result = await prisma.museum.findUnique({
				where: { id: museumId }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			let { price, type, age, is_weekday, is_weekend } = req.body;

			if (!price) {
				return res.status(400).json({
					status: false,
					message: 'price and museumId required',
					data: null
				});
			}

			let ticket = await prisma.ticket.create({
				data: {
					price,
					type,
					age,
					isWeekday: is_weekday,
					isWeekend: is_weekend,
					museumId
				}
			});

			return res.status(201).json({
				status: true,
				message: 'ticket created',
				data: ticket
			});
		} catch (error) {
			next(error);
		}
	},

	updateTicket: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let museumId = Number(req.query.museum_id);

			let result = await prisma.ticket.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'ticket not found',
					data: null
				});
			}

			let museum = await prisma.museum.findUnique({
				where: { id: museumId }
			});

			if (!museum) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			if (result.museumId !== museumId) {
				return res.status(404).json({
					status: false,
					message: 'this ticket does not belong to this museum',
					data: null
				});
			}

			let { price, type, age, is_weekday, is_weekend } = req.body;

			if (price) {
				result.price = price;
			}

			if (type) {
				result.type = type;
			}

			if (age) {
				result.age = age;
			}

			if (is_weekday) {
				result.isWeekday = is_weekday;
			}

			if (is_weekend) {
				result.isWeekend = is_weekend;
			}

			let ticket = await prisma.ticket.update({
				where: { id, museumId },
				data: {
					price: result.price,
					type: result.type,
					age: result.age,
					isWeekday: result.isWeekday,
					isWeekend: result.isWeekend
				}
			});

			return res.status(200).json({
				status: true,
				message: 'ticket updated',
				data: ticket
			});
		} catch (error) {
			next(error);
		}
	},

	deleteTicket: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let museumId = Number(req.query.museum_id);

			let result = await prisma.ticket.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'ticket not found',
					data: null
				});
			}

			let museum = await prisma.museum.findUnique({
				where: { id: museumId }
			});

			if (!museum) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			if (result.museumId !== museumId) {
				return res.status(404).json({
					status: false,
					message: 'this ticket does not belong to this museum',
					data: null
				});
			}

			let ticket = await prisma.ticket.delete({
				where: { id, museumId }
			});

			return res.status(200).json({
				status: true,
				message: 'ticket deleted',
				data: ticket
			});
		} catch (error) {
			next(error);
		}
	},

	postCollections: async (req, res, next) => {
		try {
			let museumId = Number(req.query.museum_id);

			let result = await prisma.museum.findUnique({
				where: { id: museumId }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			if (!req.files || req.files.length === 0) {
				return res.status(400).json({
					status: false,
					message: 'image required',
					data: null
				});
			}

			let collectionPromises = req.files.map(async (file) => {
				let strFile = file.buffer.toString('base64');
				let { url } = await imagekit.upload({
					fileName: Date.now() + path.extname(file.originalname),
					file: strFile
				});

				return await prisma.collection.create({
					data: {
						imageUrl: url,
						museumId
					}
				});
			});

			let collections = await Promise.all(collectionPromises);

			return res.status(201).json({
				status: true,
				message: 'collections created',
				data: collections
			});
		} catch (error) {
			next(error);
		}
	},

	updateCollection: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let museumId = Number(req.query.museum_id);

			let result = await prisma.collection.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'collection not found',
					data: null
				});
			}

			let museum = await prisma.museum.findUnique({
				where: { id: museumId }
			});

			if (!museum) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			if (result.museumId !== museumId) {
				return res.status(404).json({
					status: false,
					message: 'this collection does not belong to this museum',
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

			let collection = await prisma.collection.update({
				where: { id, museumId },
				data: {
					imageUrl: result.imageUrl
				}
			});

			return res.status(200).json({
				status: true,
				message: 'collection updated',
				data: collection
			});
		} catch (error) {
			next(error);
		}
	},

	deleteCollection: async (req, res, next) => {
		try {
			let id = Number(req.params.id);
			let museumId = Number(req.query.museum_id);

			let result = await prisma.collection.findUnique({
				where: { id }
			});

			if (!result) {
				return res.status(404).json({
					status: false,
					message: 'collection not found',
					data: null
				});
			}

			let museum = await prisma.museum.findUnique({
				where: { id: museumId }
			});

			if (!museum) {
				return res.status(404).json({
					status: false,
					message: 'museum not found',
					data: null
				});
			}

			if (result.museumId !== museumId) {
				return res.status(404).json({
					status: false,
					message: 'this collection does not belong to this museum',
					data: null
				});
			}

			let collection = await prisma.collection.delete({
				where: { id, museumId }
			});

			return res.status(200).json({
				status: true,
				message: 'collection deleted',
				data: collection
			});
		} catch (error) {
			next(error);
		}
	}
};
