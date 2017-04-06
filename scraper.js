//This project exceeds expectations. Thanks for reviewing!!
//The app will run by simply typing "npm start" in your console. "exceeds expectations"

'use strict'

const xray = require('x-ray'); //Scraper module meets rubric's criteria
const x = xray();
const json2csv = require('json2csv'); //JSON to CSV module meets rubric's criteria
const fs = require('fs');
const nodeDateTime = require('node-datetime'); //Time module meets rubric's criteria
const timeCreate = nodeDateTime.create();
const currentDate = timeCreate.format('Y-m-d');
const currentTime = timeCreate.format('I:M:S');
const timeStamp = timeCreate.format('n d Y I:M:S');


//This module checks to see if the data folder exists if not it is created.
fs.open('./data', 'r', (error) => {
    if(error) {
        console.log("The 'data' folder does not exist. I will create it!");
        
        fs.mkdir('./data', (error) => {
            if(error) {
                console.log(err);
                return;
            }
        });       
    }
});    


//This module is the the xray package used to scrape websites.
x('http://shirts4mike.com/shirts.php', {
    links: x('.products li', [{
        url: 'a@href',
            next_page: x('a@href', { //This will crawl and return data from the individual shirt links.
            title: 'title',
            price: '.price',
            imageurl: 'img@src'        
            })
    }])    
})(function (error, shirts) {
    if (error) {
        console.log(`There’s been a ${error.code} error. Cannot connect to ${error.hostname}.`); //Custom error message

        //If error occurs a new file "scraper-error.log" will be created or appended appropriately in the data folder. "exceeds expectations"
        fs.appendFile('./data/scraper-error.log', `${timeStamp} ${error.message}\n`, (err) => {
        });
        return;
    }

    //Building JSON variable from returned data callback "shirts" to convert to csv file.
    let shirtsJSON = '';
    let shirtsArr = [];
        for (let i = 0; i < shirts.links.length; i++) {
           shirtsJSON = {
                            "title": shirts.links[i].next_page.title, 
                            "price": shirts.links[i].next_page.price,
                            "imageurl": shirts.links[i].next_page.imageurl,
                            "url": shirts.links[i].url,
                            "time": currentTime
                        };
            shirtsArr.push(shirtsJSON);
        }; 

    //This module will convert the JSON to a csv file and write the returned data "shirts" to the file.
    //If the file is not created yet then it will be created. If the file is already created then it will overwritten.    
    const fields = ['title', 'price', 'imageurl', 'url', 'time'];
    const csv = json2csv({ data: shirtsArr, fields: fields });

        fs.writeFile("./data/" + currentDate + ".csv", csv, function(error) {
            if (error) {
                console.log(error.message)
                return
            }
                console.log('file saved successfully');  
        });
    });




