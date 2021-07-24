const express = require("express");
const ObjectId = require("mongodb").ObjectId;

// templateRoutes is an instance of the express router
// it will define the template routes
// the router will be added as middleware and will take control of requests starting with the path /template

const templateRoutes = express.Router();

// connect to the database
const dbo = require("../db/conn");

// get a list of templates
templateRoutes.route("/").get(function(req, res){
    let db_connect = dbo.getDb("vs");
    db_connect
        .collection("templates")
        .find({})
        .toArray(function (err, result){
            if (err) throw err;
            res.json(result);
        });
});

// create a new template
templateRoutes.route("/template/add").post(function(req, res){
    let db_connect = dbo.getDb("vs");
    let doc = { name: req.body.name, text: req.body.text };
    db_connect.collection("templates").insertOne(doc, function(err, result){
        if(err) throw err;
        res.json(result);
    });
});

// update a template by id
templateRoutes.route("/template/update/:id").post(function(req, res){
    let db_connect = dbo.getDb("vs");
    let q = { _id: new ObjectId(req.params.id) };
    let newvalues = { $set: { name: req.body.name, text: req.body.text }, };
    db_connect
        .collection("templates")
        .updateOne(q, newvalues, function(err, result){
            if(err) throw err;
            console.log("1 document updated");
            res.json(result);
        });
});

// find a template by id
templateRoutes.route("/template/:id").get(function(req, res){
    let db_connect = dbo.getDb("vs");
    let q = { _id: new ObjectId(req.params.id) };
    db_connect
        .collection("templates")
        .findOne(q, function(err, result){
            if(err) throw err;
            console.log(result);
            res.json(result);
        });
});

// delete a template
templateRoutes.route("/template/:id").delete(function(req, res) {
    let db_connect = dbo.getDb("vs");
    var q = { _id: new ObjectId(req.params.id) };
    db_connect
        .collection("templates")
        .deleteOne(q, function(err, obj){
            if (err) throw err;
            console.log("1 document deleted");
            res.json(obj);
        });
});

module.exports = templateRoutes;