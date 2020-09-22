var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    Blog = require("./models/blog"),
    User = require("./models/user"),
    middleware = require("./middleware");

mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb+srv://*****:****@kyljmn-mvoiy.mongodb.net/test?retryWrites=true&w=majority");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(require("express-session")({
  secret: "LONGASSMOTHERFUCKINGSTRING",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next()
});

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

app.get("/blogs/new", middleware.isItKyle, function(req, res){
  res.render("new");
});

app.post("/blogs", middleware.isItKyle, function(req,res){
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

app.get("/blogs/:id/edit", middleware.isItKyle, function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.send(err);
    } else {
      res.render("edit", {foundBlog : foundBlog});
    }
  });
})

app.put("/blogs/:id", middleware.isItKyle, function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedCampground){
    if(err){
      res.send(err);
    } else{
      res.redirect("/blogs/" + updatedCampground._id);
    }
  });
});

app.delete("/blogs/:id", middleware.isItKyle, function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.send(err);
    } else {
      res.redirect("/blogs");
    }
  })
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/blogs");
    });
  });
});

app.get("/login", function(req,res){
  res.render("login");
})

app.post("/login", passport.authenticate("local", {
  successRedirect: "/blogs",
  failureRedirect: "/login"
  }), function(req,res){
});
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/blogs");
});


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server started");
});
