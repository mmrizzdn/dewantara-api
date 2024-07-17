const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { JWT_SECRET } = process.env;

const { blacklistToken } = require('../middlewares/restrict');

module.exports = {
	login: async (req, res, next) => {
		try {
			let { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({
					status: false,
					message: 'email and password required'
				});
			}

			let admin = await prisma.admin.findFirst({
				where: { email }
			});

			if (!admin) {
				return res.status(400).json({
					status: false,
					message: 'invalid email or password',
					data: null
				});
			}

			let isCorrect = await bcrypt.compare(password, admin.password);

			if (!isCorrect) {
				return res.status(400).json({
					status: false,
					message: 'invalid email or password',
					data: null
				});
			}

			if (admin.isLoggedIn) {
				return res.status(401).json({
					status: false,
					message: 'admin already logged in from another session',
					data: null
				});
			}

			loggedInAdmin = await prisma.admin.update({
				where: { id: admin.id },
				data: { isLoggedIn: true }
			});

			delete loggedInAdmin.password;

			let token = jwt.sign(loggedInAdmin, JWT_SECRET, {
				expiresIn: '1h'
			});

			return res.status(201).json({
				status: true,
				message: 'login success',
				data: { ...loggedInAdmin, token }
			});
		} catch (error) {}
	},

	getAdminData: async (req, res, next) => {
		try {
			return res.status(200).json({
				status: true,
				message: 'OK',
				data: { ...req.admin }
			});
		} catch (error) {
			next(error);
		}
	},

	logout: async (req, res, next) => {
		try {
			await prisma.admin.update({
				where: { id: req.admin.id },
				data: { isLoggedIn: false }
			});

			await blacklistToken(req.token);

			return res.status(200).json({
				status: true,
				message: 'logout success',
				data: null
			});
		} catch (error) {
			next(error);
		}
	}
};
