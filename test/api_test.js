const fetch = require("node-fetch");
const apiKey = '504949294bc7419d83beebf27c708229';
let assert = require('assert');

let categories_valid = ['general', 'business', 'entertainment', 'health', 'science', 'technology'];
let categories_invalid = ['sports', 'class', 'tech', 'trend']
let search_valid = ['facebook', 'covid-19', 'usc', 'california', 'iphoneSE']
let search_invalid = ['qwertyo', '---', 'a-d-111,,dc']


/* Test With Mocha, These unit tests are used to check if we get the response 
    from the "headliner" & "search" from news api.
*/

function fetch_news_data_category(category) {
    it(`should get response data from newsApi in category: "${category}"`, async() => {
        const url = 'http://newsapi.org/v2/top-headlines?' +
                    `category=${category}&` +
                    'country=us&' +
                    `apiKey=${apiKey}`;
        await fetch(url)
            .then(res => res.json())
            .then((res) => {
                //console.log(res.totalResults);
                assert.notEqual(res.totalResults, 0);
            })
    })
}

function fetch_news_data_invalid_category(category) {
    it(`should NOT response data from invalid category: "${category}"`, async() => {
        const url = 'http://newsapi.org/v2/top-headlines?' +
                    `category=${category}&` +
                    'country=us&' +
                    `apiKey=${apiKey}`;
        await fetch(url)
            .then(res => res.json())
            .then((res) => {
                //console.log(res.totalResults);
                assert.equal(res.totalResults, 0);
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
                assert.notEqual(res.totalResults, 0);
            })
    })
}

function fetch_news_data_invalid_search(keyword) {
    it(`should NOT get response data from invalid search: "${keyword}"`, async() => {
        const url = `http://newsapi.org/v2/everything?`+
                       `q=${keyword}&` +
                       `sortBy=popularity&` +
                       `apiKey=${apiKey}`;
        await fetch(url)
            .then(res => res.json())
            .then((res) => {
                //console.log(res.totalResults);
                assert.equal(res.totalResults, undefined);
            })
    })
}

describe('newsApi_category_test', () => {
    for(category of categories_valid) {
        fetch_news_data_category(category);
    }
})

describe('newsApi_category_invalid_test', () => {
    for(category of categories_invalid) {
        fetch_news_data_category(category);
    }
})

describe('newsApi_search_test', () => {
    for(keyword of search_valid) {
        fetch_news_data_search(keyword);
    }
})

describe('newsApi_search_invalid_test', () => {
    for(keyword of search_invalid) {
        fetch_news_data_invalid_search(keyword);
    }
})





