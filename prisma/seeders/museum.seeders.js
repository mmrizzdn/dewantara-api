const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

module.exports = {
    museums: async () => {
        let filePath = path.join(__dirname, 'data', 'museums.json');
        let museums = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        for (let museum of museums) {
            const locations = museum.Location ? museum.Location.map(location => ({
                address: location.address,
                regency: location.regency,
                province: location.province,
                latitude: location.latitude,
                longitude: location.longitude
            })) : [];

            const operationalHours = museum.OperationalHour ? museum.OperationalHour.map(hour => ({
                isSunday: hour.isSunday,
                isMonday: hour.isMonday,
                isTuesday: hour.isTuesday,
                isWednesday: hour.isWednesday,
                isThursday: hour.isThursday,
                isFriday: hour.isFriday,
                isSaturday: hour.isSaturday,
                isNationalHoliday: hour.isNationalHoliday,
                startTime: hour.startTime,
                endTime: hour.endTime,
                timezone: hour.timezone
            })) : [];

            const tickets = museum.Ticket ? museum.Ticket.map(ticket => ({
                price: ticket.price,
                age: ticket.age,
                type: ticket.type,
                isWeekday: ticket.isWeekday,
                isWeekend: ticket.isWeekend
            })) : [];

            const collections = museum.Collection ? museum.Collection.map(collection => ({
                imageUrl: collection.imageUrl
            })) : [];

            await prisma.museum.create({
                data: {
                    name: museum.name,
                    about: museum.about,
                    imageUrl: museum.imageUrl,
                    Location: {
                        create: locations
                    },
                    OperationalHour: {
                        create: operationalHours
                    },
                    Ticket: {
                        create: tickets
                    },
                    Collection: {
                        create: collections
                    }
                }
            });
        }

        return console.info('museums created');
    }
};
