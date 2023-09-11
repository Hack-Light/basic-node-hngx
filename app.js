const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://user:!Somvalex@cluster0.bghcn.mongodb.net/hngx?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define Person schema
const personSchema = new mongoose.Schema({
  name: String,
});

const Person = mongoose.model("Person", personSchema);

app.use(bodyParser.json());

// Create a new person with a name provided as a query parameter
app.post("/api/people", async (req, res) => {
  try {
    const { name } = req.body;

    // Validate that 'name' is a string
    if (typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string." });
    }

    const person = new Person({ name });
    await person.save();
    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ error: "Error creating a person." });
  }
});

// Get all persons and get by name
app.get("/api/people", async (req, res) => {
  try {
    const { name } = req.query;

    // Validate that 'name' is a string
    if (name && typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string." });
    }

    if (+name) {
      return res.status(400).json({ error: "Name must be a string." });
    }

    let person;

    if (name) {
      let term = name.trim().split(/\s+/);
      person = await Person.find({
        name: { $regex: new RegExp(term, "i") },
      });
    } else {
      person = await Person.find({});
    }

    if (!person) {
      return res.status(404).json({ error: "Person not found." });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: "Error fetching a person." });
  }
});

// Get a person by ID
app.get("/api/people/:id", async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found." });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: "Error fetching a person." });
  }
});

// Update a person by ID
app.put("/api/people/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedPerson) {
      return res.status(404).json({ error: "Person not found." });
    }
    res.json(updatedPerson);
  } catch (error) {
    res.status(500).json({ error: "Error updating a person." });
  }
});

// Delete a person by ID
app.delete("/api/people/:id", async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndRemove(req.params.id);
    if (!deletedPerson) {
      return res.status(404).json({ error: "Person not found." });
    }
    res.json(deletedPerson);
  } catch (error) {
    res.status(500).json({ error: "Error deleting a person." });
  }
});

module.exports = { app, Person };

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
