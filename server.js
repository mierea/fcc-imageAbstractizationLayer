 var express = require("express");
var ImagesClient = require('google-images');

 var app = express();

 var Datastore = require('nedb'),
  db = new Datastore({
   filename: 'private/database',
   autoload: true
  });


 app.get("/", function(req, res) {
    res.send("Nothing to see here...")
 });
 
 app.get("/api/latest", function(req, res) {
  db.find({}, function (err, docs) {
    if(err) console.log(err);
   res.json(docs)
  });
  
 });
 
 
 app.get("/api/imagesearch/:query*", function(req, res) {
  
  console.log(req.params.query)
  console.log(req.query.offset)

var doc = {
 term: req.params.query,
 when: new Date().toISOString()

}

   db.insert(doc, function(err) { // Callback is optional
    // newDoc is the newly inserted document, including its _id
    if (err) return err;
    // newDoc has no key called notToBeSaved since its value was undefined
   });
   
   var client = new ImagesClient('cse id', 'api key');

   client.search(req.params.query)
    .then(function (images) {
        /*
        [{
            "url": "http://steveangello.com/boss.jpg",
            "type": "image/jpeg",
            "width": 1024,
            "height": 768,
            "size": 102451,
            "thumbnail": {
                "url": "http://steveangello.com/thumbnail.jpg",
                "width": 512,
                "height": 512
            }
        }]
         */
         res.json(images)
    });
   
   
});


 var port = process.env.PORT || 8080;
 app.listen(port, function() {
  console.log("Listening on " + port);
 });