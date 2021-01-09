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

//GET requests

app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.use('/documentation.html', express.static('public'));

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
}); 