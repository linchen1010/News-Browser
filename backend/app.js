'use strict';

const express = require('express');
const app = express();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('504949294bc7419d83beebf27c708229');
const apiKey = '504949294bc7419d83beebf27c708229';

global.fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const moment = require('moment');

////////////////////////////////////////////////////////////////////
// Set gmail username and password
let pw = 'ben841010';
let spec = `smtps://linchennn1010@gmail.com:${pw}@smtp.gmail.com`;
////////////////////////////////////////////////////////////////////

// We need cors middleware to bypass CORS security in browsers.
const cors = require('cors');

app.use(express.static('static'));
app.use(cors());

let port = process.env.PORT || 5000;
let body = ' ';

/**
 * A promise that resolves after t ms.
 * @param {Number} t
 */
const delay = function (t) {
  return new Promise((resolve) => setTimeout(resolve, t));
};

app.get('/', async function (req, res) {
  if (req.query && Object.keys(req.query).length >= 0) {
    console.log('I got a query!');
    handleGet(res, res, req.query);
  }
});

// Get data from the endpoint .../register
app.get('/register', async function (req, res) {
  if (req.query && Object.keys(req.query).length >= 0) {
    console.log('I got an email address!');
    await handleLogin(res, res, req.query);
    // wait for the email_address and category
    getNewsAsBody();
    // set time period for sending mail in (ms), (i.e. 24hrs = 86,400,000 ms, 6hrs = 21,600,000,  1hr = 3,600,000)
    setInterval(sendNotification, 21600000);
  }
});

app.listen(port, (err) => {
  console.log(`Listening on port: ${port}`);
});
//-----------------------------------------------------------------------------
/**
 * Handles a Get request
 * @param {Object} req
 * @param {Object} res
 * @param {Object} query
 */

let userEmail;
let userCategory;

/*
 * This function handle "YES" button in register page  which will get
 * user's "email_address" and "category" for latter sending news email
 */

async function handleLogin(req, res, query) {
  let error = 'NO_ERROR';
  let email_address;
  let category;

  console.log('query: ', JSON.stringify(query));

  // If there was a query (a query string was sent)
  if (
    query !== undefined &&
    query.email_address !== undefined &&
    query.category !== undefined
  ) {
    email_address = query.email_address;
    category = query.category;
  } else {
    error = 'ERROR: email_address not provided';
  }

  // Generate the output
  let output = {
    email_address: email_address,
    category: category,
  };

  // Convert output to JSON
  let outputString = JSON.stringify(output, null, 2);
  console.log('outputString: ', outputString);

  // Generate some artificial delay
  await delay(500);

  // Send it back to the frontend.
  res.send(outputString);
  userEmail = email_address;
  userCategory = category;
}

/*
 * This function handle "search" button in news page
 * which will get keywords from users
 */
async function handleGet(req, res, query) {
  let error = 'NO_ERROR';
  let searchTopic;
  console.log('query: ', JSON.stringify(query));

  // If there was a query (a query string was sent)
  if (query !== undefined && query.searchTopic !== undefined) {
    searchTopic = query.searchTopic;
  } else {
    error = 'ERROR: Search topic not provided';
  }

  //Generate the output
  let output = {
    searchTopic: searchTopic,
  };
  //check if search work
  searchTopic = query.searchTopic;
  newsapi.v2
    .everything({
      // custom search preference
      q: `${searchTopic}`,
      // from: '2020-07-30',
      // to: '2017-08-07',
      language: 'en',
      sortBy: 'relevancy',
      page: 2,
    })
    .then((response) => {
      // ** uncomment to see response **//
      // console.log(response);
    });

  // Convert output to JSON
  let outputString = JSON.stringify(output, null, 2);
  console.log('outputString: ', outputString);

  // artificial delay
  await delay(500);

  // Send it back to the frontend.
  res.send(outputString);
}

// Receive news and assign to body
const receiveNews = (newsdata) => {
  newsdata.articles.forEach((article) => {
    // load news content to body for email content
    body += `
              <div style="margin: 10px; padding: 20px; border: 3px solid lightgray; border-style: dotted;">
              <a href="${article.url}">
              <h1> ${article.title} </h1>
              </a>
              <p style ="color: #153449 "> Outline: ${article.description} </p>
              <a href="${article.url}">
              <img src="${article.urlToImage}" alt="News Image" style="width:100%">
              </a>
              </div>
              `;
  });
};

//-----------------------------------------------------------

// Assign news to body for the purpose of sending mail
function getNewsAsBody() {
  const url =
    'https://newsapi.org/v2/top-headlines?' +
    `category=${userCategory}&` +
    'country=us&' +
    `apiKey=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then(receiveNews);
  console.log('-> Body has got the news !');
  console.log('--> Ready to send email  !!');
}

// Sends an email using gmail account
function SendMail(mailOptions) {
  var transporter = nodemailer.createTransport(spec);
  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error in sending email: ', error);
      try {
        if (/quota/.test(error)) {
          console.log('We failed because of email quota!');
        }
      } catch (error) {
        console.log('Error: ', error);
      }
      return console.log(error);
    }
    console.log(`Message has been sent to "${userEmail}" ` + info.response);
  });
}

//-----------------------------------------------------------

async function sendNotification() {
  let date = moment().format('MMMM Do, YYYY');
  let upperUserCategory = userCategory.toUpperCase();

  let mailOptions = {
    from: '"News Browser" <no-reply@gmail.com>', // sender address
    to: `${userEmail}`, // list of receivers
    subject: `🔥 📰 Daily News from News Browser`, // subject line
    html: `<h1 style="text-align: center;"> ${upperUserCategory} <br> Headine News <br>
              ${date}</h1>  
              ${body} 
          <br> 
          <p><a href="http://127.0.0.1:3000"> Visit our News Browser 🔥🔥🔥</a></p>
          `,
  };
  SendMail(mailOptions);
}
