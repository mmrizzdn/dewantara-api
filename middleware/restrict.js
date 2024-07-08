const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { JWT_SECRET } = process.env;

module.exports = {
	restrict: (req, res, next) => {
		let { authorization } = req.headers;

		if (!authorization || !authorization.split(' ')[1]) {
			return res.status(401).json({
				message: 'Unauthorized'
			});
		}

		let token = authorization.split(' ')[1];
		jwt.verify(token, JWT_SECRET, async (err, admin) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					await prisma.admin.update({
						where: { id: admin.id },
						data: { isLogedIn: false }
					});

					return res.status(401).json({
						status: false,
						message: 'token expired. admin logged out',
						data: null
					});
				}

				return res.status(401).json({
					status: false,
					message: err.message,
					data: null
				});
			}

			delete admin.iat;
			req.admin = admin;

			next();
		});
	}
};
