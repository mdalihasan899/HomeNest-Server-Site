const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// FWDgJTqJkeYDAzlq
const uri = "mongodb+srv://Hasan:FWDgJTqJkeYDAzlq@cluster0.lp1xwc5.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('My first server is ready')
})


// mongodb API
async function run() {
    try {
        await client.connect();

        const HomeNestDB = client.db('HomeNestDB');
        const usersCollection = HomeNestDB.collection('users');
        const allProperties = HomeNestDB.collection('properties');

        // users API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const quary = { email: email }
            const existingUser = await usersCollection.findOne(quary);
            if (existingUser) {
                res.send('Already have user.')
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
        })

        // Property API
        app.post('/properties', async (req, res) => {
            const newPropertis = req.body;
            const result = await allProperties.insertOne(newPropertis);
            res.send(result);
        })

        // Delate Property
        app.delete('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allProperties.deleteOne(query);
            res.send(result);
        })

        // latest properties
        app.get('/latest-properties', async (req, res) => {
            const cursor = allProperties.find().limit(6).sort({ date: 1 });
            const result = await cursor.toArray();
            res.send(result)
        })

        // All properties
        app.get('/properties', async (req, res) => {
            const cursor = allProperties.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Book management server running on port ${port}`)
})