const axios = require('axios');
const fs = require('fs').promises;

async function init() {
    // Since promises can fail, we encase our asynchronous code with a try/catch clause.
    //This will capture any errors that are thrown when either the HTTP request or file writing operations fail
    try {
        const response = await axios('https://ghibliapi.herokuapp.com/films');
        let movieList = '';
        response.data.forEach(movie => {
            movieList += `${movie['title']}, ${movie['release_date']}\n`;
        });
        await fs.writeFile('asyncAwaitMovies.csv', movieList);
    } catch (error) {
        console.error(`Could not save the Ghibli movies to a file: ${error}`);
    }
}

init();