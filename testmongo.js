const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://zeenat:zeenat743@cluster0.n12j1yc.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log(error);
  }
}

run();