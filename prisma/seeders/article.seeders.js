const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

module.exports = {
	articles: async () => {
		let filePath = path.join(__dirname, 'data', 'articles.json');
		let articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		for (let article of articles) {
            let publicationDate = new Date(article.publication);
			await prisma.article.create({
				data: {
					title: article.title,
					content: article.content,
					publication: article.publication,
					imageUrl: article.imageUrl
				}
			});
		}

		return console.info('articles created');
	}
};
