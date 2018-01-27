var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require("cheerio");
var logger = require('morgan');
var path = require("path");

var {Article} = require('../server/models/Article.js');
var {Notes} = require('../server/models/Note.js');

var app = express();

app.use(express.static(path.join(__dirname, '../../public')));


router.get("/articles", function(req, res) {

  // Calls the database models and grabs the top 5 topics
  Article.find({}, (error, doc) => {
    if (error) {
      console.log(error);
    }
    else{
      var hbsObject = { articles: doc};
      return res.render("index", hbsObject);
    }
  });
});

router.get("/scrape", (req, res) => {
    // First, we grab the body of the html with request
    request("https://www.theonion.com/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every h2 within an article tag, and do the following:
      $("div.post-wrapper.js_post-wrapper").each(function(i, element) {
  
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).find('h1.headline a').text();
        result.link = $(this).find('h1.headline a').attr("href");
        result.summary = $(this).find('p').text();
        result.photo = $(this).find('div.img-wrapper img').prev().data('srcset');

       
        var entry = new Article(result);
  
        // Now, save that entry to the db
        entry.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
        });
    });
});
// Tell the browser that we finished scraping the text
res.send("Scrape Complete");
});


module.exports = router;