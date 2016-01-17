var express = require("express");
var https = require("https");
var mongo = require("mongodb").MongoClient;

var app = express();
var db;

var port = process.env.PORT || 8080

var url = "https://www.googleapis.com/customsearch/v1"
            + "?key=AIzaSyAF3nvJIfuLTNbayac5a_S7CJI9AJLxGd0"
            + "&cx=010403160145310605403:9hfavwtzflc"
            + "&searchType=image";
            
mongo.connect("mongodb://imgsearch:qazwsxedc@ds047365.mongolab.com:47365/imgsearch", function(err, database){
    if(err) throw err;
    db = database;
    
    app.listen(port, function(){
        console.log("App listening on port " + port);
    });
});


app.use(express.static("public"));

app.get("/search/:term", function(req, res){
    var googurl = url + "&q=" + req.params.term + (req.query.offset ? "&start=" +req.query.offset : "");
    console.log(googurl);
    db.collection("searches").insertOne({term: req.params.term, when: new Date().toISOString()}, function(err, result){
        if(err) throw err;
        console.log("Search term stored");
    });
    var resData = "";
    https.get(googurl, function(googres){
        googres.on("data", function(data){
            resData += data.toString();
        }).on("end", function(){
            var resJSON = [];
            JSON.parse(resData).items.forEach(function(item){
                resJSON.push({url: item.link, snippet: item.snippet, thumbnail: item.image.thumbnailLink, context: item.image.contextLink});
            });
            res.json(resJSON);
            res.end();
        });
    });
});

app.get("/latest", function(req, res){
    var searches = [];
   db.collection("searches").find().limit(10).each(function(err, doc){
       if(err) throw err;
       if(doc){
           searches.push({term: doc.term, when: doc.when});
           console.log({term: doc.term, when: doc.when});
       } else {
           res.json(searches);
           res.end();
       }
   });

});
