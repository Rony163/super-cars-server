const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gltfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('super_car');
        const productsCollections = database.collection('products');
        const orderCollection = database.collection('orders');

        // GET PRODUCTS
        app.get('/products', async (req, res) => {
            const cursor = productsCollections.find({}).limit(6);
            const products = await cursor.toArray();
            res.send(products);
        })

        // GET ALL PRODUCTS
        app.get('/allProducts', async (req, res) => {
            const cursor = productsCollections.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollections.findOne(query);
            res.json(product);
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollections.deleteOne(query);
            res.json(result);
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        });

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        });

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollections.insertOne(product);
            res.json(result);
        });

        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "shipped"
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to super car station!!!')
})

app.listen(port, () => {
    console.log(`listening port ${port}`)
})