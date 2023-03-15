require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption")

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/usersDB");
const usersSchema = new mongoose.Schema({
	email: String,
	password: String
});

usersSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});
const User = new mongoose.model("User", usersSchema);


app.get("/", function(req, res){
	res.render("home");
});

app.get("/login", function(req, res){
	res.render("login");
});

app.get("/register", function(req, res){
	res.render("register");
});


app.post("/register", function(req, res){
	const newUser = new User({
		email:req.body.username,
		password: req.body.password
	});
	newUser.save();
	res.render("secrets");
});

app.post("/login", function(req, res){
	User.findOne({email:req.body.username}).then(function(foundUser){
		if(foundUser!=""){
			if(foundUser.email===req.body.username & foundUser.password===req.body.password){
				res.render("secrets");
			}else{
				res.send("Invalid Credentials");
			}

		}else{
			res.send("User not found");
		}
		
	});
});














app.listen(3000, function(){
	console.log("app is running on port 3000");
});