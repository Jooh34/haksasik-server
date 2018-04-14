var express = require("express");

var Date = require('../models/date')

    router = express.Router();

    router.get('/', function (req, res) {
      Date.find(function(err, dates){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(dates)
      })
    });

module.exports = router;
