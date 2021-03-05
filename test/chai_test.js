const fetch = require("node-fetch");
const apiKey = '504949294bc7419d83beebf27c708229';
const expect = require('chai').expect

let categories_valid = ['general', 'business', 'entertainment', 'health', 'science', 'technology'];
let categories_invalid = ['sports', 'class', 'tech', 'trend']
let search_valid = ['facebook', 'covid-19', 'usc', 'california', 'iphoneSE']
let search_invalid = ['qwertyo', '---', 'a-d-111,,dc']

function fetch_news_data_category(category) {
    it(`should get response data from newsApi in category: "${category}"`, async() => {
        const url = 'http://newsapi.org/v2/top-headlines?' +
                    `category=${category}&` +
                    'country=us&' +
                    `apiKey=${apiKey}`;
        await fetch(url)
            .then(res => res.json())
            .then((res) => {
                //console.log(res);
                expect(res.status).to.be.equal("ok")
            })
    })
}

function fetch_news_data_search(keyword) {
    it(`should get response data from newsApi in search: "${keyword}"`, async() => {
        const url = `http://newsapi.org/v2/everything?`+
                       `q=${keyword}&` +
                       `sortBy=popularity&` +
                       `apiKey=${apiKey}`;
        await fetch(url)
            .then(res => res.json())
            .then((res) => {
                //console.log(res.totalResults);
                expect(res.status).to.be.equal("ok")
            })
    })
}


describe('newsApi_category_test', () => {
    for(category of categories_valid) {
        fetch_news_data_category(category);
    }
})

describe('newsApi_search_test', () => {
    for(keyword of search_valid) {
        fetch_news_data_search(keyword);
    }
})





