require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
// const encrypt = require("mongoose-encryption")
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
	secret:"Our little secret.",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/usersDB");
const usersSchema = new mongoose.Schema({
	username: String,
	password: String
});
usersSchema.plugin(passportLocalMongoose);

// usersSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});
const User = new mongoose.model("User", usersSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
	res.render("home");
});

app.get("/login", function(req, res){
	res.render("login");
});

app.get("/register", function(req, res){
	res.render("register");
});
app.get("/secrets", function(req, res){
	if(req.isAuthenticated()){
		res.render("secrets");
	}else{
		res.redirect("/login");
	}
}); 

app.get("/logout", function(req, res){
	req.logout(function(err){
	});
	res.redirect("/");
});


app.post("/register", function(req, res){
	User.register({username:req.body.username}, req.body.password, function(err, user){
		if(err){
			console.log(err);
			res.redirect("/register");
		}else{
			passport.authenticate("local")(req, res, function(){
				res.redirect("/secrets");
			});
		}
	});

});

app.post("/login", function(req, res){
	const user = new User({
		username: req.body.username,
		password: req.body.password
	});
	req.login(user, function(err){
		if(err){
			console.log(err);
		}else{
			passport.authenticate("local")(req, res, function(){
				res.redirect("/secrets");
			});
		}
	});

});














app.listen(3000, function(){
	console.log("app is running on port 3000");
});