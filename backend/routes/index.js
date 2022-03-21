const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const mongoDB = require('mongodb');

const client = new MongoClient(_uri, { useUnifiedTopology: true, sslValidate: false });
client.connect(err => {
	if (err) throw err;
	console.log('Connceted to MongoDBAtlas - Clinic')
});

// ------- returns user for login -------
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
	client.connect(err => { 
		if (err) throw err;
		client.db(_db).collection(collection).find(req.body).toArray((err, result) => {
			if (err) throw err;
			if (result.length === 0) {
				res.status(404).end('No Results');
				return;
			}
			res.send(JSON.stringify(result));
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