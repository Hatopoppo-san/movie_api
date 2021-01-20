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

// Authentication process 2.9
let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');


//GET requests
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// Return a list of ALL movies to the User *worked added authetication on 2.9
app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
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