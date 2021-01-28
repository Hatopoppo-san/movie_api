// In order to use app, you always need to require the app
let mongoose = require('mongoose');
const { stringify } = require('uuid');
const bcrypt = require('bcrypt');

//schema=collection you made on mongoose and you need to define each scheme here:
//required means that field has to follow this schema and it ensures that the key.
//When you set data type, these fields correspond have to be that data type(ex: boolean, string etc)
let movieSchema = mongoose.Schema({
    Title: { type: String, required: true},
    Description: { type: String, required: true},
    //Genre, Director are Subdocuments which introduce nested data.
    Genre: {
        Name: String,
        Description: String,
    },
    Director: {
        Name: String,
        Bio:String
    },
    //Array gives you an array of strings
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

//User
let userSchema = mongoose.Schema({
    Username: { type: String, required: true},
    Password: { type: String, required: true},
    Email: { type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (pasword) => {
    return bcrypt.hashSync(password, 10);
};

//This in arrow func always represents object that defined in func (userSchema.methods) but I want this to be user so use function()
userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.Password);
};

//Once you defined your schemas, you have to create models that uses schemas you defined,
//It'll be stored in data/db file as db.movies, db.users etc. Title 'Movie' create db.movies, 'User' create db.users.
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//If you want to use these, you have to export to index.js in order to use it there
module.exports.Movie = Movie;
module.exports.User = User;