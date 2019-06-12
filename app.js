var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb+srv://kyljmn:123@kyljmn-mvoiy.mongodb.net/test?retryWrites=true&w=majority");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

var userSchema = new mongoose.Schema({
  username: String,
  password: String
}); 

var   blogSchema =  new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      res.send(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

app.get("/blogs/new", function(req, res){
  res.render("new");
});

app.post("/blogs", function(req,res){
  Blog.create(req.body.blog, function(err){
    if(err){
      res.render("new");
    } else {
      res.redirect("/");
    }
  });
});

app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.send(err);
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.send(err);
    } else {
      res.render("edit", {foundBlog : foundBlog});
    }
  });
})

app.put("/blogs/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedCampground){
    if(err){
      res.send(err);
    } else{
      res.redirect("/blogs/" + updatedCampground._id);
    }
  });
});

app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.send(err);
    } else {
      res.redirect("/blogs");
    }
  })
});

app.get("/login", function(req,res){
  res.render("login");
});


app.listen(8080, function(){
  console.log("Server Running");
});
