DROP TABLE IF EXISTS favMovies;
CREATE TABLE IF NOT EXISTS favMovies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(250),
release_date VARCHAR(250),
poster_path VARCHAR(250),
overview VARCHAR(1000)
);