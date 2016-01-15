var express = require("express");
var https = require("https");
var app = express();

var port = process.env.PORT || 8080

var url = "https://www.googleapis.com/customsearch/v1"
            + "?key=AIzaSyAF3nvJIfuLTNbayac5a_S7CJI9AJLxGd0"
            + "&cx=010403160145310605403:9hfavwtzflc"
            + "&searchType=image";


app.get("/search/:term", function(req, res){
    var googurl = url + "&q=" + req.params.term + (req.query.offset ? "&start=" +req.query.offset : "");
    console.log(googurl);
    var resData = "";
    https.get(googurl, function(googres){
        googres.on("data", function(data){
            resData += data.toString();
        }).on("end", function(){
            var resJSON = [];
            JSON.parse(resData).items.forEach(function(item){
                resJSON.push({url: item.link, snippet: item.snippet, thumbnail: item.image.thumbnailLink, context: item.image.contextLink})
            })
            res.json(resJSON);
            res.end();
        });
    });
});

app.listen(port, function(){
    console.log("App listening on port " + port);
});