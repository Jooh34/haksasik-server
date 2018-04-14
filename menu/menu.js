var Crawler = require('crawler'),
    MenuModel = require('../models/menu'),
    DateModel = require('../models/date');

    var c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;

                var menus = [];

                var tr = $('tbody').first(); // 식단 부분
                $(tr).find('tr').each(function (mealtime, elem1) { // index means 아침 / 점심 / 저녁

                  var td = $(this).find('td').next() // 제목 빼기
                  $(td).find('ul').each(function (day, elem2) { // index means 요일

                    var foods = [];
                    $(this).find('li').each(function (index, elem3) {
                      foods.push($(this).text())
                    })

                    menus.push({
                      day : day-1,
                      time : mealtime,
                      name : foods,
                    })
                  })
                })

                // console.log(menus);

                var th = $('thead').first(); // 날짜 테이블

                var dates = [];
                $(th).find('th').each(function (day, elem) {

                  if(day > 0) {
                    date = $(this).text();
                    dates.push({
                      day : day-1,
                      date : date
                    })
                  }
                })

                // console.log(dates)

                // check DB should update
                var isOld;

                DateModel.findOne({'day' : 1}, function(err, result) {
                    if (err) throw err;
                    if (result !== null) isOld = result.date != dates[0].date
                    else isOld = true;

                    if(isOld) { // 최신 정보가 아니라면
                      // clean DB
                      MenuModel.remove(function(err, delOK) {
                        if (err) throw err;
                        if (delOK) console.log("Collection deleted");
                      });

                      DateModel.remove(function(err, delOK) {
                        if (err) throw err;
                        if (delOK) console.log("Collection deleted");
                      });
                      ///////////

                      // set menu on DB
                      var menu_idx = menus.length;

                      for(var i=0; i<menu_idx; i++) {
                        var menuModel = new MenuModel(menus[i]);

                        menuModel.save(function(err, user){
                          if(err) return console.error(err);
                          // else console.log('menu post success');
                        });
                      }

                      var date_idx = dates.length;

                      for(var i=0; i<date_idx; i++) {
                        var dateModel = new DateModel(dates[i]);

                        dateModel.save(function(err, user){
                          if(err) return console.error(err);
                          // else console.log('date post success');
                        });
                      }

                      console.log('updated successfully!');
                    }

                    else console.log('already updated')
                  }
                );
              }
            done();
        }
    });

module.exports = {
  crawl: function () {
    c.queue('http://injae.gwd.go.kr/site/college/page/sub03_06_04.asp');
  }
}
