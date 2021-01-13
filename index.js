// In order to use thse middleware, you have to at first require it and set a variable.

const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { runInNewContext } = require("vm");
const app = express();

app.use(bodyParser.json());


let movies = [
    {
        name: 'The Lakehouse',
        genre: 'mystery',
        actor: ['Keanu Reeves', 'Sandra Bullock']
    },
    {
        name: 'Lord of the Rings',
        genre: 'fantasy',
        actor: ['Elijah Wood', 'Orlando Bloom']
    },
    {
        name: 'The HEAT',
        genre: ['action', 'comedy'],
        actor: ['Melissa McCarthy', 'Sandra Bullock']
    },
    {
        name: 'SPY',
        genre: ['action', 'comedy'],
        actor: ['Melisa McCarthy', 'Jason Statham']
    },
    {
        name: 'The Bourne Identity',
        genre: ['action', 'mystery', 'thriller'],
        actor: 'Matt Damon'
    },
    {
        name: 'Les Miserables',
        genre: ['musical', 'drama'],
        actor: ['Hugn Jackman', 'Ann Hathaway']
    },
    {
        name: 'The Devil Wears Prada',
        genre: ['comedy', 'drama'],
        actor: ['Ann Hathaway', 'Meryl Streep']
    },
    {
        name: 'Harry Potter series',
        genre: 'fantasy',
        actor: ['Daniel Radclife', 'Emma Watson']
    },
    {
        name: 'Mission: Impossible',
        genre: 'action', 
        actor: 'Tom Cruise'
    },
    {
        name: 'Secondhand Lions',
        genre: 'comedy',
        actor: 'Harley Joel Osment'
    } 
];

let users = [
    {
        name: "John Doe",
        _email: "johndoe@123.com",
        favorites:[]
    }
];

let directors = [
    {
        name: "The Wachowskis",
        birth: "",
        death: "N/A",
        bio: "",

    }
];

let favorites = []

//GET requests
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// Return a list of ALL movies to the User
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Return data (description, genre, director, image URL, whether it's featured or not) about a single movie by title to the user
app.get('/movies/:name', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.name === req.params.name
    }));
});

//Return data about a genre(description) by name/title 
/* so far this doesn't work
app.get('/movies/:name/genre', (req, res) => {
    res.json(movies.find((movie) => {
        return Object.values(req.params.genre)
        }));

});  */

// use this temporarily for genre
 app.get('/movies/:name/genre', (req, res) => {
    res.send('Successful GET request returning data on genre')
}); 


// Return data about a director (bio, birth year, death year) by name
app.get('/directors', (req, res) => {
    res.json(directors)
});

app.get('/directors/:name', (req, res) => {
    res.json(directors.find((director) => {
        return director.name === req.params.name
    }))
});


// Allow new users to register *worked after installed body-parser & uuid. 
app.post('/users', (req, res) => {
    let newUser = req.body;

    if(!newUser.name) {
        const message = 'Missing user name in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
}); 

// Allow users to update their user info
app.put('/users/:name', (req, res) => {
    res.send('Successfully updated the profile')
});

// Allow users to add a movie to their list of favorites(showing only a text that a movie has been added)
app.put('/users/:name/favorites', (req, res) => {
    res.send('Successfully added to your favorite.')
});

//Allow users to remove  movie from their list of favorites(showing only a text that a movie has been removed)
app.delete('/users/:name/favorites', (req, res) => {
    res.send('successfully removed from your favorite.')
});

//Allow existing users to deregister (showing only a text that a user email has been removed)
app.delete('/users/:name', (req, res) => {
    res.send('Email has been removed')
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
}); 