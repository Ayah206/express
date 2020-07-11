var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
// const { stringify } = require('querystring');

var port = process.env.PORT || 4000;

mongoose.connect('mongodb://127.0.0.1:27017/addressbook');

var Schema = mongoose.Schema;

var personSchema = new Schema({
    firstname: String,
    lastname: String,
    address: String

});

var Person = mongoose.model('person', personSchema);

var arya = Person({
    firstname: 'arya',
    lastname: 'stark',
    address: 'palace of winterfell'
});

arya.save(function(err){
    if (err) throw err;
    console.log('person saved!')
});

var sansa = Person({
    firstname: 'sansa',
    lastname: 'stark',
    address: 'palace of winterfell'
}); 

sansa.save(function(err){
    if (err) throw err;
    console.log('person saved!')
});

var urlencodedParser = bodyparser.urlencoded({ extended : false});
var jsonparser = bodyparser.json();

app.use('/assets', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use( function(req, res, next){
    console.log('the requested url is ' + req.url);
    //to get all users on database
    Person.find({}, function(err, users){
        if(err) throw err;
        console.log(users);
    });

    next();
} )



app.get('/', function(req, res){
   res.render('index')
})



// app.get('/', function(req, res){
//     res.send('<html><head><link href = assets/style.css type = text/css rel = stylesheet /></head><body><h1>hello world!</h1></body></html>');
// });
app.get('/person/:id', function(req, res){
    res.render('person', {ID : req.params.id, qstr : req.query.qst } );
});

app.post('/person', urlencodedParser, function(req, res){
    console.log(req.body.first);
    console.log(req.body.last);
    res.send('congrats ' + req.body.first)  
})

app.post('/personjson', jsonparser, function(req, res){
    console.log(req.body.first);
    console.log(req.body.last);
})

app.get('/api', function(req, res){
    res.json({firstname : 'arya', lastname : 'stark' })
})
app.listen(port);