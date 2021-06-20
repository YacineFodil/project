const express = require("express");
const mongoose = require("mongoose");


const app = express();
mongoose.connect("mongodb+srv://admin:mdp@project.lxxvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true }).then(() => console.log("connected to DB"))
    .catch(err => console.error(err));


app.get("/", (req, res) => {
    res.send("hello world")
});






app.listen(5001, function () {
    console.log("Server started on port 5001.");
});
