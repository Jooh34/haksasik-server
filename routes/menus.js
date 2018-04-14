var express = require("express");

var Menu = require('../models/menu')

    router = express.Router();

    router.get('/', function (req, res) {
      Menu.find(function(err, menus){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(menus)
      })
    });

module.exports = router;
