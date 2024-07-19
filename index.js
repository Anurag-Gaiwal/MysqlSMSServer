const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "abc123",
	database : "sms22june24"
});


// set up multer for the file uploads

const storage = multer.diskStorage({
	destination: (req , file , cb) => {
		cb(null , "uploads/"); 	// Destination folder for uploads
},

filename: (req, file , cb) => {
	cb(null , Date.now() + path.extname(file.originalname)) ; // unique filename
},
});


const upload = multer({  storage  });

// Serve uploaded files statically

app.use("/uploads" , express.static('uploads'));


app.post("/save" , upload.single('file') , (req , res) => {
	let data = [req.body.rno , req.body.name , req.body.marks , req.file.filename];
	let sql = "insert into student values(? , ? , ? , ?)" ;
	con.query(sql , data , (err , result) => {
	if (err)		res.send(err);
	else			res.send(result);

});		
});

app.get("/gs" , (req , res) => {
	let sql = "select * from student" ;
	con.query(sql , (err , result) => {
		if (err)			res.send(err);
		else				res.send(result);

	});


});

app.delete("/rs" , (req, res) => {
	let data = [req.body.rno] ;
	fs.unlink("./uploads/" + req.body.image , () => {});
	let sql = "delete from student where rno = ?" ;
	con.query(sql , data , (err , result) => {
		if (err)		res.send(err);
		else			res.send(result);

	});
})

app.listen(9000 , () => { console.log("Ready to serve @ 9000"); });
