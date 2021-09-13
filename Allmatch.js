const request = require('request');
const cheerio = require('cheerio');
const scorecard = require('./Scorecard');

function Matches(err,response,html){
    if(err){
        console.log(err);
    }
    else{
       const $ = cheerio.load(html);
       const matchArray = $('a[data-hover="Scorecard"]');
       for(let i=0;i<$(matchArray).length;i++){
           const link = $(matchArray[i]).attr('href');
           const fullink = "https://www.espncricinfo.com"+link;
           request(fullink,scorecard.scorecardDetails)
       }
    }
}






module.exports = {Matches}