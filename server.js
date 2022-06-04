/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Sradha Jayan Student ID: 158924191_ Date: 04-06-2022
*
*  Online (Heroku) URL: ________________________________________________________
________________________________________________________
*
*  GitHub Repository URL: ______________________________________________________
*
********************************************************************************/

const express = require("express");
const app = express();
var path = require("path");
const port = process.env.PORT || 8080;
const blog = require("./blog-service");
app.use(express.static("public"));

var options = {
  root: path.join(__dirname),
};
app.get("/", function (req, res) {
  res.redirect("/about");
});

app.get("/about", function (req, res) {
  res.sendFile("views/about.html", options);
});

app.get("/blog", function (req, res) {
  blog
    .getPublishedPosts()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({ message: err });
    });
});

app.get("/posts", function (req, res) {
  blog
    .getAllPosts()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({ message: err });
    });
});

app.get("/categories", function (req, res) {
  blog
    .getCategories()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({ message: err });
    });
});
app.get("*", function (req, res) {
  res.send("404!!!!! Ooops you are in the wrong way!!!");
});

blog.initialize
  .then(
    app.listen(port, () => {
      console.log(`Express http server listening on ${port}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
