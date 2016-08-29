var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var dotenv = require('dotenv');
var mysql = require('./mysql');
var qsb = require('node-qsb');

dotenv.load();

function crawling(date, url) {
  console.log("URL : ", url);
  request(url, function(error, response, html) {
    if(error) {
      console.log("Crawler ERROR : ", error);
    }
    else {
      var $ = cheerio.load(html, {
        normalizeWhitespace: true
      });
      var musicInfos = [];

      $('.list-wrap')
        .children('.list')
        .children('.music-info')
        .children('.music_area')
        .children('.music')
        .each(function(i, elem) {
          musicInfos.push({
            date : date.format(),
            rank : $(this).parent('.music_area')
              .parent('.music-info')
              .parent('.list')
              .children('.number').text().trim(),
            artist : $(this).children('.meta').children('.artist').text(),
            title : $(this).children('.title').text()
          })
        })

      console.log(musicInfos);
      insertDatabase(musicInfos);
    }
  })
}

/*

*/
function insertDatabase(musicInfos) {
  var qs = new qsb().insert('musicInfos');
  var cols = [];
  var vals = [];
  for(jdx in musicInfos[0]) {
    cols.push(jdx);
    vals.push(musicInfos[0][jdx]);
  }
  qs.values(cols, vals);
  vals = [];
  for(var i = 1; i < musicInfos.length; i++) {
    for(j in musicInfos[i]) {
      vals.push(musicInfos[i][j])
    }
    qs.addValues(vals);
    vals = [];
  }

  mysql.execute(qs, function(res, err) {
    if(err) {
      console.log("MYSQL ERROR : ", err);
    }
    else {
      console.log("INSERT OK");
    }
  })
}

function dayByDay(baseUrl, params, endYmd, callback) {
  setTimeout(function() {
    if(params.ymd >= endYmd) {
      callback();
    } else {
      var paramUrl = "?";
      for(var idx in params) {
        paramUrl += idx + "=";
        if(idx === 'ymd') {
          paramUrl += params[idx].format('YYYYMMDD') + "&";
        }
        else {
          paramUrl += params[idx] + "&";
        }
      }
      var url = baseUrl + paramUrl;
      crawling(params.ymd, url);

      params.ymd.add(1, 'days');
      dayByDay(baseUrl, params, endYmd, callback);
    }
  }, process.env.SET_TIMEOUT);
}

function main() {
  var baseUrl = 'http://www.genie.co.kr/chart/top100';
  var stYmd = process.env.ST_YMD;
  var edYmd = process.env.ED_YMD;

  var params = {
    ditc : 'D',
    ymd : moment(stYmd, 'YYYYMMDD'),
    hh : process.env.HOUR,
    rtm : 'N',
    pg : '1'
  }
  dayByDay(baseUrl, params, moment(edYmd, 'YYYYMMDD'), function() {
    console.log('done');
  })
}

main();
