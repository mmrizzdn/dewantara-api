const {
	collection,
	doc,
	addDoc,
	getDocs,
	getDoc,
	updateDoc,
	deleteDoc,
	Timestamp,
} = require("firebase/firestore");

const path = require("path");

const { db } = require("../../libs/firebase");
const imagekit = require("../../libs/imagekit");

module.exports = {
	postEvent: async (req, res, next) => {
		try {
			let { name, start_date, end_date, city } = req.body;

			if (!name || !start_date || !end_date || !city || !req.file) {
				return res.status(400).json({
					status: false,
					message:
						"name, city, start date, end date, and image are required",
					data: null,
				});
			}

			let startDate = new Date(start_date);
			let endDate = new Date(end_date);

			if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
				return res.status(400).json({
					status: false,
					message: "invalid date format",
					data: null,
				});
			}

			let startTimestamp = Timestamp.fromDate(startDate);
			let endTimestamp = Timestamp.fromDate(endDate);

			let strFile = req.file.buffer.toString("base64");

			let { url } = await imagekit.upload({
				fileName: Date.now() + path.extname(req.file.originalname),
				file: strFile,
				transformation: {
					pre: "q-80",
				},
			});

			let eventRef = await addDoc(collection(db, "events"), {
				name,
				start_date: startTimestamp,
				end_date: endTimestamp,
				city,
				image_url: url,
			});

			let eventSnap = await getDoc(eventRef);

			return res.status(201).json({
				status: true,
				message: "created",
				data: {
					id: eventSnap.id,
					...eventSnap.data(),
				},
			});
		} catch (error) {
			next(error);
		}
	},

	getEvents: async (req, res, next) => {
		try {
			let querySnapshot = await getDocs(collection(db, "events"));

			if (querySnapshot.empty) {
				return res.status(404).json({
					status: false,
					message: "events is empty",
					data: null,
				});
			}

			let events = [];
			querySnapshot.forEach((event) => {
				events.push({
					id: event.id,
					...event.data(),
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

	getEvent: async (req, res, next) => {
		try {
			let { id } = req.params;

			let eventRef = doc(db, "events", id);
			let eventSnap = await getDoc(eventRef);

			if (!eventSnap.exists()) {
				return res.status(404).json({
					status: false,
					message: "event not found",
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: "OK",
				data: {
					id: eventSnap.id,
					...eventSnap.data(),
				},
			});
		} catch (error) {
			next(error);
		}
	},

	updateEvent: async (req, res, next) => {
		try {
			let { id } = req.params;
			let eventRef = doc(db, "events", id);
			let eventSnap = await getDoc(eventRef);

			if (!eventSnap.exists()) {
				return res.status(404).json({
					status: false,
					message: "event not found",
					data: null,
				});
			}

			let { name, start_date, end_date, city } = req.body;

			if (!name || !start_date || !end_date || !city || !req.file) {
				return res.status(400).json({
					status: false,
					message:
						"name, city, start date, end date, and image are required",
					data: null,
				});
			}

			let startDate = new Date(start_date);
			let endDate = new Date(end_date);

			if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
				return res.status(400).json({
					status: false,
					message: "invalid date format",
					data: null,
				});
			}

			let startTimestamp = Timestamp.fromDate(startDate);
			let endTimestamp = Timestamp.fromDate(endDate);

			let strFile = req.file.buffer.toString("base64");

			let { url } = await imagekit.upload({
				fileName: Date.now() + path.extname(req.file.originalname),
				file: strFile,
				transformation: {
					pre: "q-80",
				},
			});

			await updateDoc(eventRef, {
				name,
				start_date: startTimestamp,
				end_date: endTimestamp,
				city,
				image_url: url,
			});

			eventSnap = await getDoc(eventRef);

			return res.status(201).json({
				status: true,
				message: "updated",
				data: {
					id: eventSnap.id,
					...eventSnap.data(),
				},
			});
		} catch (error) {
			next(error);
		}
	},

	deleteEvent: async (req, res, next) => {
		try {
			let { id } = req.params;
			let eventRef = doc(db, "events", id);

			if (!eventRef) {
				return res.status(404).json({
					status: false,
					message: "event not found",
					data: null,
				});
			}

			let eventSnap = await getDoc(eventRef);

			await deleteDoc(doc(db, "events", id));

			return res.status(201).json({
				status: true,
				message: "deleted",
				data: {
					id: eventSnap.id,
					...eventSnap.data(),
				},
			});
		} catch (error) {
			next(error);
		}
	},
};
