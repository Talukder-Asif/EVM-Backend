const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.nameOfUser}:${process.env.Password}@computerclub.xdvdx.mongodb.net/?retryWrites=true&w=majority&appName=ComputerClub`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const database = client.db("KYAU_EVM");
    const userCollection = database.collection("user");



    // CRUD 
    const findUser = (email) => {
        return userCollection.findOne({ email: email });
      };
  
      app.post("/user", async (req, res) => {
        const data = req.body;
        const user = await findUser(data.email);
        if (!user) {
          const result = await userCollection.insertOne(data);
          res.send(result);
        }
      });
  
      // get User information
      app.get("/user", async (req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result);
      });
  
      // get single User information
      app.get("/user/:email", async (req, res) => {
        const userEmail = req.params.email;
        const quary = { email: userEmail };
        const result = await userCollection.findOne(quary);
        res.send(result);
      });
  
      // update User information
      app.put("/user/:email", async (req, res) => {
        const Uemail = req.params.email;
        const data = req.body;
        const filter = { email: Uemail };
        const options = { upsert: true };
        const updateTeam = {
          $set: {
            imageURL: data.imageURL,
            name: data.name,
            designation: data.designation,
            role: data.role,
            social: data.social,
          },
        };
        try {
          const result = await userCollection.updateOne(
            filter,
            updateTeam,
            options
          );
          res.send(result);
        } catch (err) {
          console.error("Error updating user:", err);
          res.status(500).send("Error updating user");
        }
      });
  
      // Delete User information
      app.delete("/user/:id", async (req, res) => {
        const id = req.params.id;
        const query = {
          _id: new ObjectId(id),
        };
        const result = await userCollection.deleteOne(query);
        res.send(result);
      }); 

    


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});