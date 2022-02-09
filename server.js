'use strict';

let express = require('express'); // express here is a module

let app = express(); // configure express ; till here i have a server that does nothing; this step is called intialization

let jsonData = require("./Movie Data/data.json");

app.get('/',homePageHandler);

app.get("/favorite",favoriteHandler);

function MovieData(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function homePageHandler(req, res){
    let movies = [];
    
    let newMovie = new MovieData(jsonData.title, jsonData.poster_path, jsonData.overview);
        movies.push(newMovie);

    res.status(200).json(movies);
};

function error500Handler() {
    return {
        status: 500,
        responseText: "Sorry, something went wrong",
    };
};

function error404Handler() {

    return {
        status: 404,
        responseText: "Page not found error",
    };

};

function favoriteHandler(req, res){

    let result = "Welcome to Favorite Page";
   
    if (res.statusCode == 500) {
       
        result = error500Handler();

    } else if (res.statusCode == 404) {
       
        result = error404Handler();
    }

    res.send(result);

};




app.listen(3000, () => {
    console.log('icanhearyou');  // we use this to check if server is listing(running)
});