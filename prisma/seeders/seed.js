const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const main = async (req, res) => {
	let password = await bcrypt.hash('admin123', 10);
	await prisma.admin.create({
		data: {
			name: 'Admin',
			email: 'admin@dewantara.com',
			password: password,
			imageUrl: ''
		}
	});

	return console.info('admin created');
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
