const fs = require("fs"); 
var posts = []
var categories=[]

var initialize = new Promise(function(resolve, reject) {
     fs.readFile('./data/posts.json', 'utf8', (err, data) => {
     if (err){
         reject(err)
     }
     else{
        posts = JSON.parse(data)
    }
    });
    fs.readFile('./data/categories.json', 'utf8', (err, data) => {
     if (err){
        reject(err)
     }
     else{
         
        categories = JSON.parse(data)
        resolve("successful")  
    }
    });
});
function getAllPosts(){
    return new Promise((resolve,reject)=>{
        if(posts.length>0){
            resolve(posts)
        }
        else{
            reject("no results returned")
        }
    })
}
function getCategories(){
    return new Promise((resolve,reject)=>{
        if(categories.length>0){
            resolve(categories)
        }
        else{
            reject("no results returned")
        }
    })
}
function getPublishedPosts(){
        return new Promise((resolve,reject)=>{
        if(posts.length>0){
            var pubPosts = posts.filter(post => post["published"]==true)
            resolve(pubPosts)
        }
        else{
            reject("no results returned")
        }
    })
}

function addPost(postData) {
  return new Promise((resolve, reject) => {
    if (postData.published == undefined) {
      postData.published = false;
    }
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    postData.postDate = date;
    postData.id = posts.length + 1;
    posts.push(postData);
    resolve(postData);
  });
}

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const res = posts.filter((post) => post.category === Number(category));
    if (res.length === 0) {
      reject("No results found");
    }
    resolve(res);
  });
}

function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const res = posts.filter((post) => {
      if (new Date(post.postDate) >= new Date(minDateStr)) {
        return true;
      } else {
        return false;
      }
    });
    if (res.length === 0) {
      reject("No Dates found");
    }
    resolve(res);
  });
}
function getPostById(idd) {
  return new Promise((resolve, reject) => {
    const res = posts.find((post) => post.id === Number(idd));
    if (res.length === 0) {
      reject("No results found");
    }
    resolve(res);
  });
}
function getPublishedPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    if (posts.length > 0) {
      var pubPosts = posts.filter(
        (post) => post.published == true && post.category == category
      );
      resolve(pubPosts);
    } else {
      reject("no results returned");
    }
  });
}
module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
  getPublishedPostsByCategory,
};
