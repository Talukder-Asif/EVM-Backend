const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.nameOfUser}:${process.env.Password}@computerclub.xdvdx.mongodb.net/?retryWrites=true&w=majority&appName=ComputerClub`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const database = client.db("KYAU_EVM");
    const userCollection = database.collection("user");
    const electionCollection = database.collection("Election");
    const departmentCollection = database.collection("Department");
    const voterCollection = database.collection("Voter");

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
          name: data.name,
          photoURL: data.photoURL,
          role: data.role,
          batch: data.batch,
          studentID: data.studentID,
          accountType: data.accountType,
          department: data.department,
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













    // CURD Of Department

    const findDepartment = (department) => {
      return departmentCollection.findOne({ department: department });
    };

    app.post("/department", async (req, res) => {
      const data = req.body;
      const department = await findDepartment(data.department);
      if (!department) {
        const result = await departmentCollection.insertOne(data);
        res.send(result);
      } else {
        res.status(409).send("Department already exists");
      }
    });

    app.get("/department", async (req, res) => {
      const result = await departmentCollection
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // Get Single Department
    app.get("/department/:id", async (req, res) => {
      const departmentId = req.params.id;
      const quary = { _id: new ObjectId(departmentId) };
      const result = await departmentCollection
        .findOne(quary)
      res.send(result);
    });
    // Delete department
    app.delete("/department/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await departmentCollection.deleteOne(query);
      res.send(result);
    });














    // CURD Of Voters

    const findVoters = (studentID) => {
      return voterCollection.findOne({ studentID: studentID });
    };

    app.post("/voter", async (req, res) => {
      const data = req.body;
      const voter = await findVoters(data.studentID);
      if (!voter) {
        const result = await voterCollection.insertOne(data);
        res.send(result);
      } else {
        res?.send("Voter already exists");
      }
    });
    // get voter
    app.get("/voter", async (req, res) => {

      const result = await voterCollection.find().sort({ studentID: 1 }).toArray();
      res.send(result);
    });



    // Delete all voters whose department matches the parameter
    app.delete("/voters/:department", async (req, res) => {
      try {
        const { department } = req.params;  
    
        const result = await voterCollection.deleteMany({
          department: department
        });
    
        res.status(200).send({ message: `All voters from ${department} deleted successfully`, result });
      } catch (error) {
        res.status(500).send({ message: `Error deleting voters from ${department}`, error });
      }
    });

















    // CURD Of Elections
    app.post("/election", async (req, res) => {
      const data = req.body;
      const result = await electionCollection.insertOne(data);
      res.send(result);
    });

    app.get("/election", async (req, res) => {
      const result = await electionCollection
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // Delete ELection
    app.delete("/election/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await electionCollection.deleteOne(query);
      res.send(result);
    });

    // update User information
    app.put("/element/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTeam = {
        $set: {
          electionName: data.electionName,
          date: data.date,
          departments: data.departments,
          details: data.details,
          candidate: data.candidate,
          voter: data.voter,
          status: data.status,
          imageURL: data.imageURL,
        },
      };
      try {
        const result = await electionCollection.updateOne(
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

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
