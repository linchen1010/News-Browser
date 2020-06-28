const apiKey = '504949294bc7419d83beebf27c708229'

function initialize() {
    document.getElementById("searchTopic").value = "";
    // Hide the loader in the beginning
    let headLine = document.getElementById("headLineTitle");
    headLine.style.display = "none";
    let searchDisplay = document.getElementById("searchDisplay");
    searchDisplay.style.display = "none";
  }

/**
 * A promise that resolves after t ms.
 * @param {Number} t 
 */

const delay = function(t) {
  return new Promise(resolve => setTimeout(resolve, t));
};
  
  initialize();

// handle login button in register page
async function login() {
  console.log("In login!");

  let email_address = document.getElementById("email_address").value;
  let subscribe = document.getElementById("subscribe").value;
  let category = document.getElementById("category").value;

  console.log("email_address: ",email_address);

  if (email_address==='') {
    alert("Please enter email address to continue!")
    return false;
  }

  console.log("subscribe: ", subscribe);
  
  document.body.style.cursor = "wait";
    
  try {
  
    // Address of backend
    let request = `http://127.0.0.1:5000/register?email_address=${email_address}&category=${category}`;
    console.log("request: ", request);
  
    // Send an HTTP GET request to the backend
    const data = await axios.get(request);
  
    console.log("data.data: ", JSON.stringify(data.data, null, 2));

    await delay(2000);
    location.replace("http://127.0.0.1:3000")
      
  } catch (error) {
    console.log("error: ", error);
    console.log("error.status: ",error.response.status)
    }
}

// user click "no" to redirect user to the news page
async function loginNo() {
    console.log("In loginNo!");
    document.body.style.cursor = "wait";
      let redirect = document.getElementById("formFooter");
      redirect.style.display = "block";

      await delay(2000);

      location.replace("http://127.0.0.1:3000")
    // Set the cursor back to default
    document.body.style.cursor = "default";
    console.log("No subcribe for daily News")
  }


/*************************
**     handle search    **
*************************/
// get searchTopic from frontend and set the url
// fetch url to get response => newsdata, then display it
async function submit() {
  console.log("In submit!");

  // Get search topic from the user
  let searchTopic = document.getElementById("searchTopic").value;
  let sortOption = document.getElementById("sortBy").value;

  console.log("sortOption now:", sortOption);
  
  let headline = document.getElementById("headLineTitle");
    headline.style.display = "none";

  if (searchTopic==='') {
    alert("Search topic is not provided!")
    return false;
  }

  let searchDisplay = document.getElementById("searchDisplay");
    searchDisplay.style.display = "block";
    searchDisplay.innerHTML = `result for "${searchTopic}" ... `;

  document.body.style.cursor = "wait";

  // clear current news before displaying new news
  let div = document.querySelector('.articles');
  while(div.firstChild){
    div.removeChild(div.firstChild);
  }

  try {

    // Address of backend
    let request = `http://127.0.0.1:5000/?searchTopic=${searchTopic}`;
    console.log("request: ", request);

    // Send an HTTP GET request to the backend
    const data = await axios.get(request);

    console.log("data.data: ", JSON.stringify(data.data, null, 2));

    // Here could set date and sort option for searching news
    let fromDate = "2020-04-05"; 
    let toDate = "2020-04-29";
    /////////////////////////////////////////////////////////////////////
    // url for search
    const url_search = `http://newsapi.org/v2/everything?`+
                       `q=${searchTopic}&` +
                      //  `from=${fromDate}&` +
                      //  `to=${toDate}&` +
                       `sortBy=${sortOption}&` +
                       `apiKey=${apiKey}`;

    const searchNews = (newsdata) => {
            const articlesDiv = document.querySelector(".articles");

            newsdata.articles.forEach((article) => {
                    
                // Create and add html elements to our html file
                const div = document.createElement("div")
                // const div = document.getElementById("articles");
                div.className = "news"
                div.innerHTML = `
                <br>
                <a href="${article.url}">
                  <img src="${article.urlToImage}" class = "w3-hover-opacity" alt="News Image" style="width:100%">
                   <div class = "content">
                    <h1> ${article.title} </h1>
                    <p> ${article.description} </p>
                    <h6 style ="color: rgb(255, 217, 0); font-weight:600;">${article.source.name}</h6>
                  </div>
                </a>
                `
                articlesDiv.appendChild(div);
                // console.log(article.source.name);
            })
        }
        await delay(1000);
        fetch(url_search)
        .then(response => response.json())
        .then(searchNews)
        
        // console.log(url_search);
    
  } catch (error) {
    console.log("error: ", error);
  }

  // Set the cursor back to default
  document.body.style.cursor = "default";
}

/*************************
**   Headline Display   **
*************************/
// fetch url to get response => newsdata, then display it
async function headLine() {

   let searchDisplay = document.getElementById("searchDisplay");
   searchDisplay.style.display = "none";

    console.log("In headLine!");

    document.body.style.cursor = "wait";
    // Show the loader element (spinning wheels)
    let headline = document.getElementById("headLineTitle");
    headline.style.display = "block";

    // clear current news before displaying new news
    let div = document.querySelector('.articles');
    while(div.firstChild){
      div.removeChild(div.firstChild);
    }

    let category = document.getElementById("category").value;
    console.log("category now: ", category);

    // display Headline News
    try {
        const url = 'http://newsapi.org/v2/top-headlines?' +
                    `category=${category}&` +
                    'country=us&' +
                    `apiKey=${apiKey}`;
        
        const receiveNews = (newsdata) => {
            const articlesDiv = document.querySelector(".articles")
            newsdata.articles.forEach((article) => {
                    
            //create and add html elements to html file
                const div = document.createElement("div")
                div.className = "news"
                div.innerHTML = `
                <br>
                <a href="${article.url}">
                <img src="${article.urlToImage}" class = "w3-hover-opacity" alt="News Image" style="width:100%">
                   <div class = "content">
                    <h1> ${article.title} </h1>
                    <p> ${article.description} </p>
                    <h6 style ="color: rgb(255, 217, 0); font-weight:600;">${article.source.name}</h6>
                  </div>
                </a>
                `
                articlesDiv.appendChild(div);
                // console.log(article.source.name);
            })
        }
        await delay(1000);
        fetch(url)
        .then(response => response.json())
        .then(receiveNews)
    } catch (error) {
      console.log("error: ", error);
    }
    // Set the cursor back to default
    document.body.style.cursor = "default";
  }
