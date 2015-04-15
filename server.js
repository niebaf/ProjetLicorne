/**
 * Created by Fabien on 13/04/2015.
 */
var express = require("express");
var app = express();

var dateFormat = require("dateFormat");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'jade');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/unicorns');
var Unicorn = require("./model/unicorns");

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/create', function (req, res) {
    res.render('create');
});

app.get('/unicorns', function (req, res) {
    return Unicorn.find(function (err, unicorns) {
        if (!err) {
            //    console.log("ok /unicorns" + unicorns)
            return res.render('liste', {unicorns: unicorns, dateFormat: dateFormat});
        } else {
            return console.log(err);
        }
    });
});

app.post('/unicorns', function (req, res) {
    console.log("POST: ");
    console.log(req.body);

    var loves = req.body.loves.split(" ");
    var myUnicorn = new Unicorn({
        name: req.body.name,
        dob: req.body.dob,
        weight: req.body.weight,
        gender: req.body.gender,
        loves: [loves],
        vampires: req.body.vampires
    });

    myUnicorn.save(function (err) {
        if (!err) {
            console.log("created");
            return res.render('ficheValidation', {
                newUnicorn: {
                    "name": req.body.name
                }
            });
        } else {
            return console.log(err);
        }
    });
});

app.get('/delete/:name', function (req, res) {
    console.log(req.params["name"]);
    Unicorn.remove({name: req.params["name"]}, function (err) {

        if (!err) {
            console.log("delete");
            res.render('ficheSuppression', {
                deleteUnicorn: {
                    "name": req.params["name"]
                }
            })
        } else {
            return console.log(err);
        }
    })
});

app.get('/update/:name', function (req, res) {
    Unicorn.findOne({'name': req.params.name}, function (err, result) {
        if (err) {
            console.log("fail");
        }
        else {
            console.log("update");
            res.render('ficheUpdate', {updateUnicorn: result, dateFormat: dateFormat})
        }
    })
});

app.post('/updateLicorne', function (req, res) {
    var loves = req.body.loves.split(" ");

    Unicorn.findOneAndUpdate({name: req.body.name}, {
        $set: {
            name: req.body.name,
            dob: req.body.dob,
            weight: req.body.weight,
            gender: req.body.gender,
            loves: [loves],
            vampires: req.body.vampires
        }
    }).exec(function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            console.log("update");
            //res.redirect('/');
            res.render('ficheModifie', {
                updatedUnicorn: {
                    "name": req.body["name"]
                }
            })
        }
    });

});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port)
});