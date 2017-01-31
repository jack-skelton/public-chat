var express = require('express');
var router = express.Router();
var moment = require('moment');
var mysql = require('mysql');

var database = {
  host     : 'localhost',
  user     : 'root',
  password : 'skelton1',
  database : 'publicchat'
}


/* POST add message */
router.post('/', function(req, res, next) {
  if (req.body.message || req.body.name) {
    req.body.message = req.body.message || 'nothing';
    req.body.name = req.body.name || 'anonymous';

    var connection = mysql.createConnection(database);
    connection.query('delete from messages limit 1', function (error, results, fields) {if (error) throw error;});
    connection.query('insert into messages values(' + mysql.escape(req.body.name) + ',' + mysql.escape(req.body.message) + "," +  mysql.escape(moment().format('DD-MM hh:mm:ss')) + ");", 
    function (error, results, fields) {
      if (error) throw error;
      connection.end();
      next();
    });
  } else {
    next();
  }
});

router.all('/', function(req, res, next) {
  var connection = mysql.createConnection(database);
  connection.query('select * from messages', 
  function (error, results, fields) {
    if (error) throw error;
    var messages = results;

    res.render('index', {messages});
  });


});

module.exports = router;
