const express = require("express");
const AWS = require('aws-sdk');
const serverless = require("serverless-http")

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

AWS.config.update({
    region: 'us-east-1', // Replace with your desired AWS region
  });

const documentClient = new AWS.DynamoDB.DocumentClient();


app.get("/get-food-menu/:restaurant_id",function(req,res){
    var id = req.params.restaurant_id?req.params.restaurant_id:null

    if(id){
         // Get an item from the table
        const getParams = {
            TableName: 'food-menu-table', 
            FilterExpression: 'restaurant_id = :value', 
            ExpressionAttributeValues: {
              ':value': id, 
            },
        };
        documentClient.scan(getParams, (err, data) => {
            if (err) {
              res.status(500).send({'err':err});
            } else {
              res.status(200).send({"data":data.Items})
            }
          });
    }
    else{
        res.status(200).send({'err':"Restaurant id missing"})
    }

   
        
})



module.exports.handler = serverless(app)

