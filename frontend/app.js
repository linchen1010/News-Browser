const express = require("express");
const app = express();

let port = 3000;

// Make everything under public folder available to the outside world
// Don't put anything sensitive here.
// Examples: html files, css files, javascript (frontend), images
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/news.html");
});

app.route("/register").get(function(req,res) {
  res.sendFile(__dirname + "/public/register.html");
});

app.listen(port, err => {
  console.log(`Listening on port: ${port}`);
});
