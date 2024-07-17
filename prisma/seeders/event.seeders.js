const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

module.exports = {
	events: async () => {
		let filePath = path.join(__dirname, 'data', 'events.json');
		let events = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		for (let event of events) {
			await prisma.event.create({
				data: {
					name: event.name,
					startDate: event.startDate,
					endDate: event.endDate,
					location: event.location,
                    imageUrl: event.imageUrl
				}
			});
		}

		return console.info('events created');
	}
};
