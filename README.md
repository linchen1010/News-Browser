# News-Browser

This is my first web appliaction project.  
It's a full-stack project for USC EE599

The website allows users to browse the news with difference sources and specific categories. Users could also decide if they want to receive daily headliner via email address.

## Tool

* Frontend: HTML, CSS, Bootstrap4
* Backend: Node.js, Express
* NewsAPI: [NewsApi](https://newsapi.org)  Power by NewsAPI.org.


## Feactures

### Subscription: 
* Allow users to subscribe daily headliner with selected category, which will be sent to the user's email address by backend server every 24 hours.
### Headliner:
* Browse headliner from different sources with selected category.
### Keyword Search:
* Users could search their interested news by enter keywords in the search search box with prefered search options.

## Getting Started

#### You will need an API key from [https://newsapi.org](https://newsapi.org).
for more about NewsAPI, click [here](https://github.com/bzarras/newsapi)

### Clone and install package
```bash
git clone https://github.com/linchen1010/News-Browser.git
npm install
```

### Run frontend and backend
```bash
npm run start
```

Then open your browser at http://localhost:3000/register to register.html

or http://localhost:3000 to news.html


## Overview
* Register page for users to enter email
![Register page](/image/register.png)
* News page
![News page](/image/newsPage.png)
* Search preview
![Search example](/image/SearchExample.gif)
* Email - Headliner with category "Sports"
![Email example](/image/email.gif)

## Future Work
* customize news for users like "popular news"
* users could specify news source (i.e. bbc, cnn)
* users' comment

## Link
[Youtube video](https://www.youtube.com/watch?v=bYj5a5SZ_Xs)

## Author

Shi-Lin Chen(shilinch@usc.edu)
