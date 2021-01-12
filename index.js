const express = require("express");
const app = express();

let movies = [
    {
        title: 'The Lakehouse',
        actor: ['Keanu Reeves', 'Sandra Bullock']
    },
    {
        title: 'Lord of the Rings',
        actor: ['Elijah Wood', 'Orlando Bloom']
    },
    {
        title: 'The HEAT',
        actor: ['Melissa McCarthy', 'Sandra Bullock']
    },
    {
        title: 'SPY',
        actor: ['Melisa McCarthy', 'Jason Statham']
    },
    {
        title: 'The Bourne Identity',
        actor: 'Matt Damon'
    },
    {
        title: 'Les Miserables',
        actor: ['Hugn Jackman', 'Ann Hathaway']
    },
    {
        title: 'The Devil Wears Prada',
        actor: ['Ann Hathaway', 'Meryl Streep']
    },
    {
        title: 'Harry Potter series',
        actor: ['Daniel Radclife', 'Emma Watson']
    },
    {
        title: 'Mission: Impossible',
        actor: 'Tom Cruise'
    },
    {
        title: 'Secondhand Lions',
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
//GET requests


app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// Return a list of ALL movies to the User
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Return data (description, genre, director, image URL, whether it's featured or not) about a single movie by title to the user
app.get('movies/:name', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.name === req.params.name
    }));
});

//Return data about a genre(description) by name/title
app.get('/movies/:name/genre', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.genre === req.params.genre
    }));
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:name', (req, res) => {
    res.json(directors.find((director) => {
        return directors.name === req.params.name
    }));
});

// Allow new users to register
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
    let user = new user({
        name: req.params.name
    });

    if(user) {
        user.updateOne({ name: req.params.name}, user).then(
            () => {
                res.status(201).json({
                    message: 'User name updatated successfully!'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        )
    };
});

// Allow users to add a movie to their list of favorites(showing only a text that a movie has been added)
app.put('/movies/:name', (req, res) => {
    res.send('Successfully added to your favorite.')
});

//Allow users to remove  movie from their list of favorites(showing only a text that a movie has been removed)
app.delete('users/:name/:favorites', (res, req) => {
    res.send('successfully removed from your favorite.')
});

//Allow existing users to deregister (showing only a text that a user email has been removed)
app.delete('/users/:email', (req, res) => {
    let user = user.filter((obj) => {
        return obj.email === req.params.email
    });

    if(user) {
        users = user.filter((obj) => {
            return obj.email !== req.params.email
        });
        res.status(201).send(`User ${req.params.email} was deleted.`);
    }
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
}); 