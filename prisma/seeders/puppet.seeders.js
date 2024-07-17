const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

module.exports = {
	puppets: async () => {
		let filePath = path.join(__dirname, 'data', 'puppets.json');
		let events = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		for (let event of events) {
			await prisma.puppet.create({
				data: {
					name: event.name,
					description: event.description,
					imageUrl: event.imageUrl
				}
			});
		}

		return console.info('puppets created');
	}
};
