var express = require("express");
var app = express();
var path = require("path");
var mongo = require('mongodb').MongoClient;
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public'))); // location of scripts and styles
app.use(bodyParser.urlencoded({ extended: false })); // needed to parse POST requests

// home page
app.get("/", function(req, res){
    res.render("index");
});

// request for quotes is received
app.get("/get", function(req, res){
    var mLabUri = "mongodb://" + process.env.readerId +
        ":" + process.env.readerPass + "@ds061246.mlab.com:61246/projects";
    mongo.connect(mLabUri, function(err, db){
        if (err){
            throw err;
            res.end(err);
        } else {
            db.collection("quotes").find().toArray(function(err, docs){
                res.status(200).json({data : docs});
                db.close();
            });
        }
    })
});

// page where the user can add quotes
app.get("/add", function(req, res){
    res.render("addNewQuote");
});

// request to add quotes
app.post("/add", function(req, res){
    var data = {
        "text" : req.body.quote,
        "author" : req.body.author
    };

    var mLabUri = "mongodb://" + process.env.writerId +
        ":" + process.env.writerPass + "@ds061246.mlab.com:61246/projects";

    mongo.connect(mLabUri, function(err, db){
        if (err){
            throw err;
        } else {
            db.collection("quotes").insert(data, function(err, data){
                if (err){
                    throw err;
                }
                db.close();
            });
        }
    });
});

app.listen(port, function(){
    console.log("Listening on port " + port);
});
