var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require("cheerio");
var logger = require('morgan');
var path = require("path");
var mongoose = require('mongoose');

var {Article} = require('../server/models/Article.js');
var {Note} = require('../server/models/Note.js');

var app = express();

app.use(express.static(path.join(__dirname, '../../public')));

// Index Page Render (first visit to the site)
router.get('/', function (req, res){
  
  // Scrape data
  
  res.render("scrape")
});


router.get("/scrape", (req, res) => {
  // First, we grab the body of the html with request
  request("https://www.theonion.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.post-wrapper.js_post-wrapper").each(function(i, element) {
      
      // Save an empty result object
      var newStory = {
        title: $(this).find('h1.headline a').text(),
        link: $(this).find('h1.headline a').attr("href"),
        summary: $(this).find('p').text(),
        photo: $(this).find('div.img-wrapper img').prev().data('srcset')
      };
      
      
      var newArticle = new Article (newStory);
      
      // Now, save that entry to the db
      newArticle.save(function(err, doc) {
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
});


router.get('/articles', function(req, res) {

  // Calls the database models and grabs the top 5 topics
  Article.find()
    .populate('notes')
       // Then, send them to the handlebars template to be rendered
    .exec(function(error, doc){
    if (error) {
      console.log(error);
    }
    else{
      var hbsObject = { articles: doc}
      return res.render("index", hbsObject);
    }
  });
});

// Taking name and comment entered by user and attaching them to the article in database
router.post('/add/comment/:id', function (req, res){
  
  // Collect article id
  var articleId = req.params.id;
  
  // Collect Author Name
  var commentAuthor = req.body.name;
  
  // Collect Comment Content
  var commentContent = req.body.comment;

  // "result" object has the exact same key-value pairs of the "Comment" model
  var userNote = {
    _id: new mongoose.Types.ObjectId(),
    name: commentAuthor,
    comment: commentContent
  };

  // Using the Note model, create a new comment entry
  var newNote = new Note (userNote);
    // Save the newNote to the database
   newNote.save()
    .then(function() {
      return Article.findOne({"_id": articleId})
    })
    .then(function(article) {
      article.notes = userNote._id;
      return article.save()
    })
    .then(function () {
      res.json(userNote);
    })
    .catch(function (err) {
      console.log(err);
    })
    res.redirect('/articles');
});



// Delete a Comment Route
router.post('/remove/comment/:id', function (req, res){

  // Collect comment id
  var commentId = req.params.id;

  // Find and Delete the Comment using the Id
  Article.findByIdAndRemove(commentId, function (err, todo) {  
    
    if (err) {
      console.log(err);
    } 
    else {
      // Send Success Header
      res.redirect('/articles');
    }

  });

});


module.exports = router;