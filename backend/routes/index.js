var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/first', function (req, res, next) {
  res.json({
    name: 'aaa',
    pwd: '123'
  });
});

router.get('/test', function (req, res, next) {
  res.json({
    goods: [{
        name: '小明'
      },
      {
        name: '小红'
      }
    ]
  });
});

module.exports = router;