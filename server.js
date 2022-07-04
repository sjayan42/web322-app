/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Sradha Jayan Student ID: 158924191_ Date: 04-06-2022
*
*  Online (Heroku) URL: https://web322-app-sradha.herokuapp.com/about
*
*  GitHub Repository URL: https://github.com/sjayan42/web322-app
********************************************************************************/

const express = require("express");
const app = express();
var path = require("path");
const port = process.env.PORT || 8080;
const blogData = require("./blog-service");
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier');
const exphbs  = require("express-handlebars")
const stripJs = require('strip-js');


cloudinary.config({
    cloud_name: 'j3rin',
    api_key: '124343851727697',
    api_secret: 'nhkt6ZRAhFCRxUxwQurtmN8-W1U',
    secure: true
});

const hbs = exphbs.create({
  extname:'.hbs',
  helpers:{
    navLink: function(url, options){
    return '<li' + 
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
}
,
  equal: function (lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
},
safeHTML: function(context){
    return stripJs(context);
}

  }
})
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

const upload = multer(); 

app.use(express.static("public"));
var options = {
  root: path.join(__dirname),
};
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/, "");
    app.locals.viewingCategory = req.query.category;
    next();
});



app.get("/", function (req, res) {
  res.redirect("/blog");
});

app.get("/about", function (req, res) {
  res.render('about')
});
app.get("/addPost", function (req, res) {
  res.render('addPost')
});
app.get("/posts",function(req,res){
      let categoryVal = req.query.category;
      let minDateStr = req.query.minDate;
      if(categoryVal){
        blogData.getPostsByCategory(categoryVal).then((data)=>{
          res.send(data)
        }).catch((error)=>{
          res.render("categories",{message:"no results"})
        })
      }
      else if(minDateStr){
        blogData.getPostsByMinDate(minDateStr).then((data)=>{
        res.send(data)
      }).catch((error)=>{
        res.send({"message":error})
      })
      }
      else{
        blogData
    .getAllPosts()
    .then((data) => {
      res.render("posts",{posts:data});
    })
    .catch((err) => {
      res.render("posts",{ message:"No Result Found" });
    });
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
      blogData.getPostById(id).then((data)=>{
        res.send(data)
      }).catch((error)=>{
        res.send({"message":error})
      })
    })
    app.get("/categories", function (req, res) {
      blogData
        .getCategories()
        .then((data) => {
        res.render("categories",{categories:data})
        })
        .catch((err) => {
          res.render("categories",{message:"no results"})
        });
    });


app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});
app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blogData.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

// app.get("/posts", function (req, res) {
//   blog
//     .getAllPosts()
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.send({ message: err });
//     });
//     });



app.get("*", function (req, res) {
  res.render("404");
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
blogData.addPost(req.body).then((data)=>{
  res.redirect("/posts")
}).catch((error)=>res.send({"message":error}));
})
blogData.initialize
  .then(
    app.listen(port, () => {
      console.log(`Express http server listening on ${port}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
