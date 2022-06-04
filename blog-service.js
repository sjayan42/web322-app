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
module.exports = { initialize,getAllPosts,getPublishedPosts,getCategories}
