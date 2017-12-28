const express =  require('express');
const mongodb = require('mongodb')
const logger =  require('morgan');
const bodyParser =  require('body-parser');
const errorhandler =  require('errorhandler');


const url = 'mongodb://localhost:27017/accountsList';
let app  =  express();
app.use(bodyParser.json());
app.use(logger('dev'));


mongodb.MongoClient.connect(url, (error,database) => {
    if(error) return process.exit(1);
    const db = database.db('accountsList');
    console.log("Connection is OK");

    app.get('/accounts',(req,res)=>{
        db.collection('accounts').find().toArray((error,results)=>{
            if(error) return next(error);
            console.log(results);
            res.send(results);
        });
    });


    app.post('/accounts',(req, res)=>{
        let newAccount =  req.body;
        db.collection('accounts').insert(newAccount,(error,results)=>{
            if(error)  return next(error);
            res.send(results);
        });
    });

    app.put('/accounts/:id',(req,res)=>{
        console.log(req.body);
        db.collection('accounts').update(
            {_id: mongodb.ObjectID(req.params.id)},
            {$set:req.body},
            (error,resutls)=>{
                if(error) console.log(error);
                res.send(resutls);
            });
    });

    app.delete('/accounts/:id',(req,res)=>{
        db.collection('accounts').remove({_id: mongodb.ObjectID(req.params.id)},(error,results)=>{
            if(error) console.log(error);
            res.send(results);
        });
    });

    app.listen(3000);
});