const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const mongoDB = require('mongodb');

const client = new MongoClient(_uri, { useUnifiedTopology: true, sslValidate: false });
client.connect(err => {
	if (err) throw err;
	console.log('Connected to MongoDBAtlas - Clinic')
});

// ------- return user for login -------
router.post('/login', (req, res) => {
	let credentials = req.body;
	client.db(_db).collection('Users').findOne(credentials, (err, user) => {
		if (err) throw err;
		if (user === null) {
			res.status(404).end();
			return;
		}
		res.status(200).send(JSON.stringify(user))
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
		client.db(_db).collection(collection).find(query).toArray((err, result) => {
			if (err) throw err;
			res.status(200).send(JSON.stringify(result));
		});	
	});
});

// ------- insert a document -------
router.post('/insert/:collection', (req, res) => {
	let collection = req.params.collection;
	let form = req.body;
	client.db(_db).collection(collection).insertOne(form, (err, result) => { 
		if (err) throw err;
		res.status(200).end();
	});
});

// ------- update a document -------
router.put('/update/:collection/:id', (req, res) => {
	let id = req.params.id;
	let collection = req.params.collection;
	let form = req.body;
	delete form._id;
	let query = { _id: new mongoDB.ObjectId(id) };
	let newValues = { $set: form };
	client.db(_db).collection(collection).updateOne(query, newValues, (err, result) => {
		if (err) throw err;
		res.status(200).end();
	});
});

// ------- delete a document -------
router.delete('/delete/:collection/:id', (req, res) => {
	let id = req.params.id;
	let collection = req.params.collection;
	let query = { _id: new mongoDB.ObjectId(id) };
	client.db(_db).collection(collection).deleteOne(query, (err, result) => {
		if (err) throw err;
		res.status(200).end();
	});
});

module.exports = router;