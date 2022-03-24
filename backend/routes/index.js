const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { MongoClient } = require('mongodb');
const mongoDB = require('mongodb');

const client = new MongoClient(process.env.URI, { useUnifiedTopology: true, sslValidate: false });
client.connect(err => {
	if (err) throw err;
	console.log('Connected to MongoDBAtlas - Clinic')
});
const database = process.env.DB

// ------- return user for login -------
router.post('/login', (req, res) => {
	let credentials = req.body;
	client.db(database).collection('Users').findOne({'username': credentials.username}, async (err, user) => {
		if (err) throw err;
		// if username not found
		if (!user) {
			res.status(404).end();
			return;
		}
		// compare password and hash
		let valid = await bcrypt.compare(credentials.password, user.password);
		console.log(user.password)
		if (valid) {
			res.status(200).send(JSON.stringify(user));
		}
		else {
			res.status(404).end();
		}
	});
});

// ------- get documents -------
router.post('/query/:collection', (req, res) => {
	let collection = req.params.collection;
	let query = req.body;
	if (query.$or) {
		// access each object in $or array
		for (let object of query.$or) {
			// access each key in object
			for (let key in object) {
				// set value of object as the value in regex
				object[key] = new RegExp(object[key], 'gi');
			}
		}
	}
	client.connect(err => { 
		if (err) throw err;
		client.db(database).collection(collection).find(query).toArray((err, result) => {
			if (err) throw err;
			res.status(200).send(JSON.stringify(result));
		});	
	});
});

// ------- insert a document -------
router.post('/insert/:collection', async (req, res) => {
	let collection = req.params.collection;
	let form = req.body;
	if (collection === 'Users') {
		// create hash of password using 12 salt rounds
		const hash = await bcrypt.hash(form.password, 12);
		form.password = hash;
		// create id manually because sometimes mongo 
		// would only insert an empty string for the id. not sure why
		let id = new mongoDB.ObjectId();
		form._id = id;
		client.db(database).collection(collection).insertOne(form, (err, result) => { 
			if (err) throw err;
			res.status(200).end();
		});
	}
	else {
		// create id manually because sometimes mongo 
		// would only insert an empty string for the id. not sure why
		let id = new mongoDB.ObjectId();
		form._id = id;
		client.db(database).collection(collection).insertOne(form, (err, result) => { 
			if (err) throw err;
			res.status(200).end();
		});
	}
});

// ------- update a document -------
router.put('/update/:collection/:id', async (req, res) => {
	let id = req.params.id;
	let collection = req.params.collection;
	let form = req.body;
	delete form._id;
	if (form.personalAccount) {
		if (form.personalAccount.changeUsername) {
			delete form.personalAccount;
			let query = { _id: new mongoDB.ObjectId(id) };
			let newValues = { $set: form };
			client.db(database).collection(collection).updateOne(query, newValues, (err, result) => {
				if (err) throw err;
				res.status(200).end();
			});
		}
		else if (form.personalAccount.changePassword) {
			delete form.personalAccount;
			client.db(database).collection('Users').findOne({'username': form.username}, async (err, user) => {
				let valid = await bcrypt.compare(form.oldPassword, user.password);
				if (valid) {
					delete form.oldPassword;
					const hash = await bcrypt.hash(form.password, 12);
					form.password = hash;
					let query = { _id: new mongoDB.ObjectId(id) };
					let newValues = { $set: form };
					await client.db(database).collection(collection).updateOne(query, newValues, (err, result) => {
						if (err) throw err;
						res.status(200).end();
					});
				}
				else {
					res.status(404).json('Incorrect Password');
				}
			});
		}
	}
	else {
		let query = { _id: new mongoDB.ObjectId(id) };
		let newValues = { $set: form };
		client.db(database).collection(collection).updateOne(query, newValues, (err, result) => {
			if (err) throw err;
			res.status(200).end();
		});
	}
});

// ------- delete a document -------
router.delete('/delete/:collection/:id', (req, res) => {
	let id = req.params.id;
	let collection = req.params.collection;
	let query = { _id: new mongoDB.ObjectId(id) };
	client.db(database).collection(collection).deleteOne(query, (err, result) => {
		if (err) throw err;
		res.status(200).end();
	});
});

module.exports = router;