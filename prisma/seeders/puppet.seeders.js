const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

module.exports = {
	puppets: async () => {
		let filePath = path.join(__dirname, 'data', 'puppets.json');
		let puppets = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		for (let puppet of puppets) {
			await prisma.puppet.create({
				data: {
					name: puppet.name,
					description: puppet.description,
					type: puppet.type,
					imageUrl: puppet.imageUrl
				}
			});
		}

		return console.info('puppets created');
	}
};
