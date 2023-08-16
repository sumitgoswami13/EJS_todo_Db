const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
const DB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/todo-app", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

const itemschema = new mongoose.Schema({
    list: {
        type: String,
        required: true,
    },
});

const Item = mongoose.model("Item", itemschema);

app.post("/", async (req, res) => {
    const newItem = req.body.ele1;
    try {
        const item = new Item({
            list: newItem,
        });
        await item.save();
        res.redirect("/");
    } catch (error) {
        console.error("Error saving item:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/delete/:id", async (req, res) => {
    const itemId = req.params.id;
    try {
        await Item.findByIdAndDelete(itemId);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/", async (req, res) => {
    try {
        const items = await Item.find();
        res.render("index", { list: items });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).send("Internal Server Error");
    }
});

DB();
app.listen(8000, () => {
    console.log("Server started on port 8000");
});
