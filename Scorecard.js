const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path =require('path');
const xlsx = require('xlsx')

function scorecardDetails(err,response,html){
    if(err){
        console.log(err);
    }
    else{
    
        const $ = cheerio.load(html);
        const description = $('.description');
        const details = $(description[0]).text().split(',');
        // venue 
        const venue = details[1].trim();
        // date
        const date = details[2].trim();
        
        // teams
        const teams = $('a[data-hover].name-link');
        const teamA = $(teams[0]).text().trim();
        const teamB = $(teams[1]).text().trim();
        // result
        

        let result = $(".event .status-text");
        result = $(result).text().trim();
      
   //     console.log(`${venue} | ${date} | ${teamA} | ${teamB} | ${result}`);

        // batsman details

        const BatsmanCard = $(".table.batsman tbody");

        for(let i=0;i<BatsmanCard.length;i++){
            const BatsManrow = $(BatsmanCard[i]).find('tr');

            for(let j = 0;j<$(BatsManrow).length;j++){
                const BatsMan = $(BatsManrow[j]);
                const BatsManDetails = $(BatsMan).find('td');
               
                if($(BatsManDetails).length>4){
                    const playername = $(BatsManDetails[0]).text().trim();
                    const runs = $(BatsManDetails[2]).text().trim();
                    const bowls = $(BatsManDetails[3]).text().trim();
                    const fours = $(BatsManDetails[5]).text().trim();
                    const sixes = $(BatsManDetails[6]).text().trim();
                    const strikeRate = $(BatsManDetails[7]).text().trim();
                    const opponent = i==0?teamB:teamA;
                    const team = i==0?teamA:teamB;
     //               console.log(`${name} | ${runs} | ${bowls} | ${fours} | ${sixes} | ${strikeRate}`)
                     processPlayer(playername,runs,bowls,fours,sixes,strikeRate,venue,opponent,team,date,result);
                }
            }
        }
        
    }
}

function processPlayer(playername,runs,bowls,fours,sixes,strikeRate,venue,opponent,team,date,result){
    let teamPath = path.join(__dirname,"ipl",team);
    makeDir(teamPath);
    const playerobj = {
        playername,opponent,venue,date,runs,bowls,fours,sixes,strikeRate,result
    }
    // reads xml if not present than it will have empty array else it will have sone data
    let filePath = path.join(teamPath,playername+".xlsx")
    let content = readxml(filePath,playername);
    content.push(playerobj)
    // writes xml will create xml if not present there else it will update  the content
    writexml(filePath,content,playername);

}



function readxml(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        
        return [];
    }
    else{
     
        let wb = xlsx.readFile(filePath);
        let xlData = wb.Sheets[sheetName];
        let ans = xlsx.utils.sheet_to_json(xlData);
        return ans; 
    }
}
function writexml(filePath,json,sheetName){
    console.log(json)
    let newWb = xlsx.utils.book_new();
    let newWs = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWb,newWs,sheetName) 
    xlsx.writeFile(newWb,filePath);
    
}






function makeDir(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
    
}



module.exports = {scorecardDetails}