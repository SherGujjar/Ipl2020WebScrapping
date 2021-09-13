const request = require('request');
const cheerio = require('cheerio');
const AllMatch = require('./Allmatch')
const fs = require('fs');
const path = require('path');

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"
const filePath = path.join(__dirname,"ipl");
makeDir(filePath)
request(url,cb);
function cb(err,response,html){
    if(err){
        console.log(err)
    }
    else{
        const $ = cheerio.load(html);
        const link = $('.widget-items.cta-link a[data-hover]').attr('href');
        const fullLink =  "https://www.espncricinfo.com"+link;
        request(fullLink,AllMatch.Matches)
    }
}

function makeDir(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
    
}