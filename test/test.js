let should = require('should');
const fetch = require("node-fetch");
let assert = require('assert')


const apiKey = '504949294bc7419d83beebf27c708229';


let category = ['general', 'business', 'entertainment', 'health', 'science', 'technology'];
async function headlineTest() {
for(cate of category) {
    
    const url = 'http://newsapi.org/v2/top-headlines?' +
              `category=${cate}&` +
              'country=us&' +
              `apiKey=${apiKey}`;
    const receiveNews = (newsdata) => {
            console.log(cate,":", newsdata.totalResults);
            newsdata.totalResults.should.not.equal(0);
            newsdata.status.should.equal('ok');
        }
 await   fetch(url)
         .then(response => response.json())
         .then(receiveNews)
}
}


let search = ['facebook', 'covid-19', 'usc', 'california', 'iphoneSE'] // randomly choose for the keyword search
async function searchTest() {
    for(s of search) {
        // console.log(cate);
        const url_search = `http://newsapi.org/v2/everything?`+
                       `q=${s}&` +
                       `sortBy=popularity&` +
                       `apiKey=${apiKey}`;
        const receiveNews = (newsdata) => {
                console.log(s,":", newsdata.totalResults);
                newsdata.totalResults.should.not.equal(0);
                newsdata.status.should.equal('ok');
                
            }
     await   fetch(url_search)
             .then(response => response.json())
             .then(receiveNews)
    }
    }

async function test() {
    await headlineTest()
    searchTest();
}

test();






