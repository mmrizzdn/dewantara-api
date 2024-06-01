const {
	collection,
	addDoc,
	getDoc,
	getDocs,
	Timestamp,
} = require("firebase/firestore");
const { db } = require("../../libs/firebase");

module.exports = {
	postEvent: async (req, res, next) => {
		try {
			let { name, year, month, day, city } = req.body;

			if (!name || !year || !month || !day || !city) {
				return res.status(400).json({
					status: false,
					message: "name, year, month, day, and city are required",
					data: null,
				});
			}

			let date = new Date(year, month - 1, day);
			let timeStamp = Timestamp.fromDate(date);

			let event = await addDoc(collection(db, "events"), {
				name,
				date: timeStamp,
				city,
			});

			let docSnap = await getDoc(event);

			let timestampSnap = docSnap.data().date;
			let dateSnap = new Date(timestampSnap.seconds * 1000);

			let daySnap = dateSnap.getDate();
			let monthSnap = dateSnap.getMonth() + 1;
			let yearSnap = dateSnap.getFullYear();

			return res.status(201).json({
				status: true,
				message: "Created",
				data: {
					id: docSnap.id,
					date: `${daySnap}-${monthSnap}-${yearSnap}`,
					name: docSnap.data().name,
					city: docSnap.data().city,
				},
			});
		} catch (error) {
			next(error);
		}
	},

	getEvents: async (req, res, next) => {
		try {
			let querySnapshot = await getDocs(collection(db, "events"));

			if (querySnapshot.length === 0) {
				return res.status(404).json({
					status: false,
					message: "events not found",
					data: null,
				});
			}

			let events = [];
			querySnapshot.forEach((doc) => {
				let timestampSnap = doc.data().date;
				let dateSnap = new Date(timestampSnap.seconds * 1000);

				let daySnap = dateSnap.getDate();
				let monthSnap = dateSnap.getMonth() + 1;
				let yearSnap = dateSnap.getFullYear();

				events.push({
					id: doc.id,
					date: `${daySnap}-${monthSnap}-${yearSnap}`,
					name: doc.data().name,
					city: doc.data().city,
				});
			});

			return res.status(200).json({
				status: true,
				message: "OK",
				data: events,
			});
		} catch (error) {
			next(error);
		}
	},
};
