var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb+srv://kyljmn:123@kyljmn-mvoiy.mongodb.net/test?retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var   blogSchema =  new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
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

app.listen(8080, function(){
  console.log("Server Running");
});
