const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser')

const cors = require('cors');

const admin = require('firebase-admin');
admin.initializeApp();

const app = express();
app.use(bodyParser.json())
app.use(cors({ origin: true }));

// show workers
const getWorkers = async (req, res) => {
    const snapshot = await admin.firestore().collection('workers').get();
    const workers = []
    snapshot.forEach((doc) => {
        let id = doc.id;
        let data = doc.data();

        workers.push({ id, ...data })
    });
    res.status(200).send(JSON.stringify(workers));
}

// get all workers
app.get('/', async (req, res) => {
    await getWorkers(req, res)
})

// get worker by id
app.get('/:id', async (req, res) => {
    const snapshot = await admin.firestore().collection('workers').doc(req.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();

    res.status(200).send(JSON.stringify({ id: userId, ...userData }));
})

// add worker
app.post('/', async (req, res) => {
    const body = req.body;

    await admin.firestore().collection('workers').add(body);
    getWorkers(req, res)
})

//update worker
app.put("/:id", async (req, res) => {
    const body = req.body;
    await admin.firestore().collection("workers").doc(req.params.id).update({ name: body.name, email: body.email });
    getWorkers(req, res)
})

//delete worker
app.delete("/:id", async (req, res) => {
    await admin.firestore().collection("workers").doc(req.params.id).delete();
    getWorkers(req, res)
})

exports.user = functions.https.onRequest(app);

const port = 3000;
app.listen(port, () => {
    console.log('Server is ready at ' + port);
});