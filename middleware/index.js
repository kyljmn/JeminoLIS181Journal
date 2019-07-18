var User = require("../models/user");
var middlewareObj = {};

middlewareObj.isItKyle = function(req, res, next){
  if(req.isAuthenticated()){
    if(req.user._id.equals("5d02363348f3ea153c1e2bfb")){
      next();
    } else {
      res.send("you not kyle");
    }
  } else {
    res.redirect("back");
  }
}

module.exports = middlewareObj;
