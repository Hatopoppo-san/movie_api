// In order to use thse middleware, you have to at first require it and set a variable.

const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { runInNewContext } = require("vm");
const app = express();

//Import what you did in models.js
const mongoose = require('mongoose');
const Models = require('./models.js');
const { send } = require("process");
const Movies = Models.Movie;
const Users = Models.User;
//Connect to the server you created
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

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
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// Return a list of ALL movies to the User *worked
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Return data (description, genre, director, image URL, whether it's featured or not) about a single movie by title to the user
// *worked
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.err(err);
            res.status(500).send('Error: ' + err);
        });

});

//Return data about a genre(description) by name/title 
app.get('/movies/genre/:Genre', (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Genre })
        .then((genre) => {
            res.json(genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
})


// Return data about a director (bio, birth year, death year) by name
app.get('/movies/director/:Director', (req, res) => {
    Director.findOne({ Name: req.params.Director })
     .then((director) => {
         res.json(director);
     })
     .catch((err) => {
         console.error(err);
         res.status(500).send('Error: ' + err);
     });
});

app.get('/directors/:name', (req, res) => {
    res.json(directors.find((director) => {
        return director.name === req.params.name
    }))
});

//Get all users
app.get('/users', (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//Get a user by specific name
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Allow new users to register 
app.post('/users', (req, res) => {
 Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if(user) {
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
             .create({
                 Username: req.body.Username,
                 Password: req.body.Password,
                 Email: req.body.Email,
                 Birthday: req.body.Birthday
             })
             .then((user) => { res.status(201).json(user) })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    })
}); 

// Allow users to update their user info by username
/* We'll expect JSON in this format
{
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
} */
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate ({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true }, //This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Allow users to add a movie to their list of favorites(showing only a text that a movie has been added)
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, //This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        } 
    });
});

//Allow users to remove  movie from their list of favorites(showing only a text that a movie has been removed)
app.delete('/users/:Username/Movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
        if(err){
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Delete a user by username
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if(!user){
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err)
    });
});

//Allow existing users to deregister (showing only a text that a user email has been removed)
app.delete('/users/:name', (req, res) => {
    res.send('Email has been removed')
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
}); 