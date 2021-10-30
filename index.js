const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const e = require('express');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const ObjectId = require("mongodb").ObjectId;
const port = 5000;

app.get('/', (req, res) => {
    res.send('travel agency website server')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gv57l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("travel_mafia");
      const packageCollection = database.collection("packages");
      const orderCollection = database.collection("orders");

      //get packages api
      app.get('/packages', async (req, res) => {
        const cursor = packageCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
      })

      //get api for showing individual package in place order page
      app.get('/packages/package/:id', async (req, res) => {
        const Id = req.params.id;
        const query = {_id: ObjectId(Id)};
        const result = await packageCollection.findOne(query); 
        res.json(result);
      })

      //get api for showing all orders
      app.get('/allorders', async (req, res) => {
        const cursor = orderCollection.find({});
        const result = await cursor.toArray();
        res.json(result);
      })

      //post api for adding new packages
      app.post('/packages/addpackage', async (req, res) => {
        const doc = req.body;
        const result = await packageCollection.insertOne(doc);
        res.json(result);
      })

      //post api for place a new order
      app.post('/packages/placeorder', async (req, res) => {
        const doc = req.body;
        const result = await orderCollection.insertOne(doc);
        res.json(result);
      })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.listen(port, () => {
    console.log('listening to the port: ', port)
})