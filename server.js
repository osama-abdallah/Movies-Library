'use strict';

// let query= "10950"
let pg = require("pg");


let express = require('express'); // express here is a module

let app = express(); // configure express ; till here i have a server that does nothing; this step is called intialization

let jsonData = require("./Movie Data/data.json");

let axios = require("axios");

const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());

const database_url = process.env.DATABASE_URL

// const res = require('express/lib/response');
const client = new pg.Client(database_url)

const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;

app.get('/',homePageHandler);

app.get("/favorite",favoriteHandler);

app.get("/trending",trendingHandler);

app.get("/search", searchHandler);

app.get("/movieId/:id", movieIdHandler);

app.get("/movieCredits", creditsHandler);

app.post("/addMovie", addmovieHandler);

app.get("/getMovie", getMovieHandler);

function addmovieHandler (req , res){
    // console.log(req.body);  
    const movie = req.body;

    const sql = `INSERT INTO favmovies(title, release_date, poster_path, overview ) VALUES($1, $2, $3, $4)`;

    let values = [movie.title, movie.release_date, movie.poster_path, movie.overview];

    client.query(sql, values).then((data) => {
        return res.status(201).json(data.rows);
    })
}

function getMovieHandler(req, res){

    const sql = `SELECT * FROM favmovies`;

client.query(sql).then(data => {
    return res.status(200).json(data.rows);
})
}
 


function MovieData(id,title,release_date, poster_path, overview) {
   this.id = id;
    this.title = title;
   this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function homePageHandler(req, res){
    let movies = [];
    
    let newMovie = new MovieData(jsonData.title, jsonData.poster_path, jsonData.overview);
        movies.push(newMovie);

    res.status(200).json(movies);
};

function error500Handler(error,req,res) {
    return {
        status: 500,
        responseText: "Sorry, something went wrong",
    };
};

function error404Handler(error,req,res) {

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

function trendingHandler(req,res){
    let movies = [];

    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`).then((trendingData)=>{

        trendingData.data.results.forEach(ele => {
            
            let newMovie = new MovieData(ele.id, ele.title, ele.release_date, ele.poster_path, ele.overview);            
            movies.push(newMovie) });
            // console.log(ele);
          return  res.status(200).send(movies);
    });

}

function searchHandler(req,res){
   let movies = [];
//    console.log(req.query);

    let querySearch = req.query.q;

    // console.log(querySearch);
axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${querySearch}`).then((searchData)=>{
 searchData.data.results.forEach(ele => {
            
            let newMovie = new MovieData(ele.id, ele.title, ele.release_date, ele.poster_path, ele.overview);            
            movies.push(newMovie) });
            // console.log(ele);
          return  res.status(200).send(movies);
    });

}

function movieIdHandler(req,res){ //url request : http://127.0.0.1:3004/movieId/10950
    
    
    let movieIdDet = req.params.id;
    //console.log(req.query); //https://api.themoviedb.org/3/movie/{movie_id}?api_key=${APIKEY}&language=en-US

axios.get(`https://api.themoviedb.org/3/movie/${movieIdDet}?api_key=${APIKEY}&language=en-US`).then((result)=>{
            
            let newMovie = new MovieData(result.data.id, result.data.original_title, result.data.release_date, result.data.poster_path, result.overview);            
                        // console.log(result.data);
          return  res.status(200).json(newMovie);
    });

}

function CastData(id,name,original_name, character){
    this.id = id;
     this.name = name;
    this.original_name = original_name;
     this.character = character;
}


function creditsHandler(req,res){ //url request : http://127.0.0.1:3004/movieCredits?d=10950 
    
  
    
    let movieCred = req.query.d;


    
    axios.get(`https://api.themoviedb.org/3/movie/${movieCred}/credits?api_key=${APIKEY}&language=en-US`).then((value)=>{
        // value.data.cast.map
        return res.status(200).json(value.data.cast.map(ele =>{
            return new CastData(ele.id, ele.name, ele.original_name, ele.character)
        }))
            });
        }
client.connect().then(()=>{
    app.listen(PORT, () => {
        console.log(`listening on port${PORT}`);  // we use this to check if server is listing(running)
    });
});



//APIKEY = 68b3268dd4980111467b76cc9a4025eb