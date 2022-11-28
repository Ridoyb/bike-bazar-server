const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.17mhv8n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const categoriesCollection = client.db('bikeBazar').collection('categories');
        const productsCollection = client.db('bikeBazar').collection('products');
        const usersCollection = client.db("bikeBazar").collection("users");
        const bookingsCollection = client.db("bikeBazar").collection("bookings");
        const advertiseCollection = client.db("bikeBazar").collection("advertise");
        const paymentCollection = client.db("bikeBazar").collection("payment");


        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });



        app.get('/products/:category', async (req, res) => {
            const category=req.params.category;
            const query = {category: (category)}
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        
      

          
          app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
          });
      
          // get users
      
          app.get("/users", async (req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
          });
      
          // single product
      
          app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
          });
      
          // booking post
      
          app.post("/bookings", async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
          });
      
          // post product
      
          app.post("/add-a-product", async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
          });
          // advertised
      
          
      
          // get my products api
      
          app.get("/my-products/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { email };
            const result = await productsCollection.find(filter).toArray();
            res.send(result);
          });
      
          // delete product api
      
          app.delete("/my-products/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(filter);
            res.send(result);
          });
      
          // get my order api
      
          app.get("/my-orders/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { email };
            const result = await bookingsCollection
              .find(filter)
              .sort({ _id: -1 })
              .toArray();
            res.send(result);
          });


          app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const booking = await bookingsCollection.findOne(query);
            res.send(booking);
        })


        // add advertise items
    app.post("/advertise", async (req, res) => {
        const wishlist = req.body;
        const advertise = await advertiseCollection.find(wishlist).toArray();
        if (advertise.length) {
          const message = 'You Already added this on advertised';
          return res.send({ acknowledge: false, message });
        }
        const result = await advertiseCollection.insertOne(wishlist);
        res.send(result);
      });
      app.get("/advertise", async (req, res) => {
        // const email = req.query.email;
        const query = {  };
        const advertise = await advertiseCollection.find(query).toArray();
        res.send(advertise);
      });




      // check a user is a admin or not
    app.get('/users/admin/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);
        res.send({ isAdmin: user?.role === 'admin' });
    })
    // check a user is a seller or not
      app.get('/users/seller/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);
        res.send({ isSeller: user?.check === 'seller' });
    })
    // check a user is a buyer or not
      app.get('/users/buyer/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);
        res.send({ isBuyer: user?.check === 'user' });
    })


     

}
    finally {

    }

}

run().catch(console.dir);

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Hello, Server is running....')
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})


