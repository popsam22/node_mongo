const express = require('express');
const {connectToDB, getDB} = require('./database');
const { ObjectId } = require('mongodb');

const app = express();

app.use(express.json()); // this parses incoming json requests

//database connection
let db;
connectToDB(err => {
    if(!err){
        app.listen(3004, () => {
            console.log('app listening on port 3003');
        });
        db = getDB()// returns the db connection object
    }
})

//middlewares
app.get('/staff', (req, res, next)=>{
    let staffs = [];

    db.collection('staff')
    .find()
    .forEach(staff => staffs.push(staff)) //where batch cycling occurs
    .then(() => {
        res.status(200).json(staffs)
    })
    .catch(() => {
        res.status(400).json({error: 'could not fetch staff from database'})
    })
});

app.get('/staff/:id', (req, res, next) => {

//we will only fetch a document if the id is present in the mongoDB
    if(ObjectId.isValid(req.params.id)){
        db.collection('staff')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(document => {
            res.status(200).json(document)
        })
        .catch(err => {
            res.status(400).json({err: 'Document could not be retrieved'})
        })
    } else{
        res.status(401).json({error: 'id contains invalid syntax'})
    }
}) 

// post request to staff
app.post('/staff', (req, res, next) => {
    const staff = req.body;
    db.collection('staff')
    .insertOne(staff)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(400).json({err:'Invalid File Upload Format'})
    })
})

//delete request to staff
app.delete('/staff/:id', (req, res, next) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('staff')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(document => {
            res.status(201).json(document)
        })
        .catch(err => {
            res.status(400).json({err: 'Document could not be deleted'})
        })
    } else{
        res.status(400).json({err: 'Document does not exist '})
    }
})


//sending patch request to staff
app.patch('/staff/:id', (req, res, next) => {
    const updates = req.body;

    if(ObjectId.isValid(req.params.id)){
        db.collection('staff')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set : updates})
        .then(document => {
            res.status(200).json(document)
        })
        .catch(err => {
            res.status(400).json({error: 'Document could not  be updated'})
        })
    } else {
        res.status(400).json({error: 'Document does not exist'})
    }
})