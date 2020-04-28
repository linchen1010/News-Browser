"use strict";

const express = require("express");
const app = express();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('504949294bc7419d83beebf27c708229');
const apiKey = '504949294bc7419d83beebf27c708229';

global.fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const moment = require("moment");

let pw = "ben841010";
// Set gmail username and password
let spec = `smtps://linchennn1010@gmail.com:${pw}@smtp.gmail.com`;

// We need cors middleware to bypass CORS security in browsers.
const cors = require("cors");

app.use(express.static("static"));
app.use(cors());

let port = 5000;
let body = " ";

/**
 * A promise that resolves after t ms.
 * @param {Number} t 
 */
const delay = function(t) {
  return new Promise(resolve => setTimeout(resolve, t));
};

app.get("/", async function(req, res) {
  if (req.query && Object.keys(req.query).length >= 0) {
    console.log("I got a query!");
    handleGet(res, res, req.query);
  }
});

app.get("/register", async function(req, res) {
  if (req.query && Object.keys(req.query).length >= 0) {
    console.log("I got an email address!");
    await handleLogin(res, res, req.query);
    // wait for the email_address and category
    getNewsAsBody();
    setInterval(sendNotification, 10000)
  }
})

app.listen(port, err => {
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

async function handleLogin(req, res, query) {
  let error = "NO_ERROR";
  let email_address;
  let category;

  console.log("query: ", JSON.stringify(query));

  // If there was a query (a query string was sent)
  if (
    query !== undefined &&
    query.email_address !== undefined &&
    query.category !== undefined
  ) {
    email_address = query.email_address;
    category = query.category;
  } else {
    error = "ERROR: email_address not provided";
  }

  // Generate the output
  let output = {
    email_address : email_address,
    category: category
  };

  // Convert output to JSON
  let outputString = JSON.stringify(output, null, 2);
  console.log("outputString: ", outputString);

  // Generate some artificial delay
  await delay(500);

  // Send it back to the frontend.
  res.send(outputString);
  userEmail = email_address;
  userCategory = category;
}


/*****************************
** handle get (searchTopic) **
******************************/
async function handleGet(req, res, query) {

  let error = "NO_ERROR";
  let searchTopic;
  console.log("query: ", JSON.stringify(query));

  // If there was a query (a query string was sent)
  if (
    query !== undefined &&
    query.searchTopic !== undefined
  ) {
    searchTopic = query.searchTopic;
  } else {
    error = "ERROR: Search topic not provided";
  }

  //Generate the output
  let output = {
    searchTopic: searchTopic
  };
    //check if search work
  searchTopic = query.searchTopic;
  newsapi.v2.everything({
    q: `${searchTopic}`,
    from: '2020-04-01',
    to: '2017-04-23',
    language: 'en',
    sortBy: 'relevancy',
    page: 2
  }).then(response => {
      // ** uncomment to see response **
      // console.log(response);
    });

  //Convert output to JSON
  let outputString = JSON.stringify(output, null, 2);
  console.log("outputString: ", outputString);

  //artificial delay!
  await delay(500);

  // Send it back to the frontend.
  res.send(outputString);
}

// Recieve news and assign to body //
const recieveNews = (newsdata) => {
  newsdata.articles.forEach((article) => {    
    // load news content to body for email content
    body +=  `
              <div style="margin: 10px; border: 3px solid lightgray; border-style: dotted;">
              <a href="${article.url}">
              <h1> ${article.title} </h1>
              </a>
              <p style ="color: #153449 "> Outline: ${article.description} </p>
              <a href="${article.url}">
              <img src="${article.urlToImage}" alt="News Image" style="width:100%">
              </a>
              </div>
              `
  })
}

//-----------------------------------------------------------

// assign news to body for sending mail
function getNewsAsBody() {
  const url = 'http://newsapi.org/v2/top-headlines?' +
              `category=${userCategory}&` +
              'country=us&' +
              `apiKey=${apiKey}`;
  fetch(url)
  .then(response => response.json())
  .then(recieveNews)
  console.log("-> Body has got the news !")
  console.log("--> Ready to send email  !!")
}


// Sends an email using gmail account
function SendMail(mailOptions) {
  var transporter = nodemailer.createTransport(spec);
  return transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log("Error in sending email: ", error);
      try {
        if (/quota/.test(error)) {
          console.log("We failed because of email quota!");
        }
      } catch (error) {
        console.log("Error: ", error);
      }
      return console.log(error);
    }
    console.log(`Message has been sent to "${userEmail}" ` + info.response);
  });
}
//-----------------------------------------------------------

async function sendNotification() {
  
  let date = moment().format("MMMM Do YYYY");

  let mailOptions = {
    from: '"News Browser" <no-reply@gmail.com>', // sender address
    to: `${userEmail}`, // list of receivers
    subject: `🔥 📰 Daily News from News Browser`, // Subject line
    html: `<h1>Headine News  -- <br>
              ${date}</h1>  
              ${body} 
          <br> 
          <p><a href="http://127.0.0.1:3000"> Visit our News Browser 🔥🔥🔥</a></p>
          `
  };
  SendMail(mailOptions);
}