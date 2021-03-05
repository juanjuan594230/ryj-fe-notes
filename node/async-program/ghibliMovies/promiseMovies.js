const axios = require('axios');
const fs = require('fs').promises;

let movies;

axios.get('https://ghibliapi.herokuapp.com/films')
    .then((res) => {
        console.log('Successfully retrieved our list of movies');
        let movies = 'Title, Date\n';
        res.data.forEach(movie => {
            movies += `${movie['title']}, ${movie['release_date']}\n`
        });
        return fs.writeFile('promiseMovies.csv', movies); // return promise
    })
    .then((res) => {
        console.log('res', res);
    })
    .catch((error) => {
        console.log(error.message);
    });