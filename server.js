/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Sradha Jayan Student ID: 158924191_ Date: 04-06-2022
*
*  Online (Heroku) URL: https://git.heroku.com/web322-app-sradha.git
*
*  GitHub Repository URL: https://github.com/sjayan42/web322-app
********************************************************************************/

const express = require("express");
const app = express();
var path = require("path");
const port = process.env.PORT || 8080;
const blog = require("./blog-service");
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier');
const e = require("express");



cloudinary.config({
    cloud_name: 'j3rin',
    api_key: '124343851727697',
    api_secret: 'nhkt6ZRAhFCRxUxwQurtmN8-W1U',
    secure: true
});

const upload = multer(); 

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
app.get("/posts/add", function (req, res) {
  res.sendFile("views/addPost.html", options);
});
app.get("/posts",function(req,res){
      let categoryVal = req.query.category;
      let minDateStr = req.query.minDate;
      if(categoryVal){
        blog.getPostsByCategory(categoryVal).then((data)=>{
          res.send(data)
        }).catch((error)=>{
          res.send({"message":error})
        })
      }
      else{
        blog.getPostsByMinDate(minDateStr).then((data)=>{
        res.send(data)
      }).catch((error)=>{
        res.send({"message":error})
      })
      }
    })
    // app.get("/posts",function(req,res){
    //   let minDateStr = req.query.date;
    //   blog.getPostsByMinDate(minDateStr).then((data)=>{
    //     res.send(data)
    //   }).catch((error)=>{
    //     res.send({"message":error})
    //   })
    // })
    
    app.get("/posts/:id",function(req,res){
      const id = req.params.id;
      blog.getPostById(id).then((data)=>{
        res.send(data)
      }).catch((error)=>{
        res.send({"message":error})
      })
    })
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



app.get("*", function (req, res) {
  res.send("404!!!!! Ooops you are in the wrong way!!!");
});

app.post("/posts/add",upload.single("featureImage"),function(req,res){
  if(req.file){
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }

    upload(req).then((uploaded)=>{
        processPost(uploaded.url);
    });
}else{
    processPost("");
}
function processPost(imageUrl){
    req.body.featureImage = imageUrl;

    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
} 
blog.addPost(req.body).then((data)=>{
  res.redirect("/posts")
}).catch((error)=>res.send({"message":error}));
})
blog.initialize
  .then(
    app.listen(port, () => {
      console.log(`Express http server listening on ${port}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
