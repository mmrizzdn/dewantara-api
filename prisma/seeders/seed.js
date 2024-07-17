const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const { articles } = require('./article.seeders');
const { events } = require('./event.seeders');
const { puppets } = require('./puppet.seeders');
const { museums } = require('./museum.seeders');

const main = async () => {
	let password = await bcrypt.hash('admin123', 10);
	await prisma.admin.create({
		data: {
			name: 'Admin',
			email: 'admin@dewantara.com',
			password: password,
			imageUrl: ''
		}
	});

	console.info('admin created');

	await articles();
	await events();
	await puppets();
	await museums();
};

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
