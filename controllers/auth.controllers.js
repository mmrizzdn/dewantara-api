const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { JWT_SECRET } = process.env;

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

			await prisma.admin.update({
				where: { id: admin.id },
				data: { isLoggedIn: true }
			});

			delete admin.password;
			let token = jwt.sign({ admin }, JWT_SECRET, { expiresIn: '1h' });

			return res.status(201).json({
				status: true,
				message: 'login success',
				data: { ...admin, token }
			});
		} catch (error) {}
	}
};
