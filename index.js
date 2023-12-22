const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://disgusted-skirt.surge.sh"],
    credentials: true,
  })
);
//access post body and convert into json format
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.es62grd.mongodb.net/?retryWrites=true&w=majority`;

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
    //database collection
    const todoCollection = client.db("todo").collection("task");

    //******todo related API*****
    //get all todo data
    app.get("/data", async (req, res) => {
      const result = await todoCollection.find().toArray();
      res.send(result);
    });

    //get specific todo id data
    app.get("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await todoCollection.findOne(query);
      res.send(result);
    });

    //get specific user todo data
    app.get("/data/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await todoCollection.find(query).toArray();
      res.send(result);
    });

    //post todo data
    app.post("/data", async (req, res) => {
      const todoData = req.body;
      const result = await todoCollection.insertOne(todoData);
      res.send(result);
    });

    //patch method for specific coupon update
    app.patch("/updateTodo/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          name: item.name,
          description: item.description,
          date: item.date,
          priority: item.priority,
        },
      };
      const result = await todoCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    //todo delete api
    app.delete("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    console.log("Successfully DB connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

//for testing
app.get("/", (req, res) => {
  res.send("task-management server is running");
});

app.listen(port, () => {
  console.log(`task-management server is running on port ${port}`);
});
