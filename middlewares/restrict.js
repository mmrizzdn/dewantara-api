const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { JWT_SECRET } = process.env;

module.exports = {
	restrict: async (req, res, next) => {
		let { authorization } = req.headers;

		if (!authorization || !authorization.split(' ')[1]) {
			return res.status(401).json({
				status: false,
				message: 'token not found',
				data: null
			});
		}

		let token = authorization.split(' ')[1];

		let blacklistedToken = await prisma.blacklistedToken.findUnique({
			where: { token }
		});

		if (blacklistedToken) {
			return res.status(401).json({
				status: false,	
				message: 'token blacklisted',
				data: null
			});
		}

		jwt.verify(token, JWT_SECRET, async (err, admin) => {
			if (err) {
				await prisma.admin.update({
					where: { id: 1 },
					data: { isLoggedIn: false }
				});

				return res.status(401).json({
					status: false,
					message: `${err.message}. admin logged out`,
					data: null
				});
			}

			delete admin.iat;
			delete admin.exp;

			req.admin = admin;
			req.token = token;

			next();
		});
	},

	blacklistToken: async (token, next) => {
		await prisma.blacklistedToken.create({
			data: { token, expiresAt: new Date() }
		});
	}
};
