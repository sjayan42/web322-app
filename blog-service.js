const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "dcglnomr6nfn3b",
  "vmuzwplmvlfmvh",
  "49bb039eaf00923c45a2bbe261b110f84f9aff80fa48504f6347be5ef75febef",
  {
    host: "ec2-3-219-52-220.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var initialize = new Promise(function (resolve, reject) {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(function () {
        resolve("Success");
      })
      .catch((err) => {
        reject("unable to sync the database");
      });
  });
});
function getAllPosts() {
  return new Promise((resolve, reject) => {
    const data = Post.findAll()
      .then(() => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
}
function getCategories() {
  return new Promise((resolve, reject) => {
    const data = Category.findAll()
      .then(() => {
        resolve(data);
      })
      .catch((err) => {
        {
          reject("no results returned");
        }
      });
  });
}
function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    const data = Post.findAll({
      where: {
        published: true,
      },
    })
      .then(() => {
        resolve(data);
      })
      .catch((err) => {
        {
          reject("no results returned");
        }
      });
  });
}

function addPost(postData) {
  postData.published = postData.published ? true : false;
  for (const att in postData) {
    if (postData[att] == "") {
      postData[att] = null;
    }
  }
  postData.postDate = new Date();
  return new Promise((resolve, reject) => {
    Post.create(postData)
      .then(() => {
        resolve("Post Created");
      })
      .catch((err) => {
        reject("unable to create post");
      });
  });
}

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const data = Post.findAll({
      where: {
        category: category,
      },
    })
      .then(() => {
        resolve(data);
      })
      .catch((err) => {
        {
          reject("no results returned");
        }
      });
  });
}

function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const { gte } = Sequelize.Op;

    const data = Post.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDateStr),
        },
      },
    })
      .then(() => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
}
function getPostById(idd) {
  return new Promise((resolve, reject) => {
    const data = Post.findAll({
      where: {
        id: idd,
      },
    })
      .then(() => {
        resolve(data[0]);
      })
      .catch((err) => {
        {
          reject("no results returned");
        }
      });
  });
}
function getPublishedPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const data = Post.findAll({
      where: {
        published: true,
        category: category,
      },
    })
      .then(() => {
        resolve(data);
      })
      .catch((err) => {
        {
          reject("no results returned");
        }
      });
  });
}
function addCategory(categoryData) {
  for (const att in categoryData) {
    if (categoryData[att] == "") {
      categoryData[att] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Category.create(categoryData)
      .then(() => {
        resolve("Category Created");
      })
      .catch((err) => {
        reject("unable to create category");
      });
  });
}
function deleteCategoryById(idd) {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: {
        id: idd,
      },
    })
      .then(() => {
        resolve("Deleted");
      })
      .catch((err) => {
        {
          reject("Was rejected");
        }
      });
  });
}
function deletePostById(idd) {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: {
        id: idd,
      },
    })
      .then(() => {
        resolve("Deleted");
      })
      .catch((err) => {
        {
          reject("Was rejected");
        }
      });
  });
}

var Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});
var Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});
Post.belongsTo(Category, { foreignKey: "category" });
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
  addCategory,
  deleteCategoryById,
  deletePostById
};
