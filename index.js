const express = require('express')
const app = express()
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