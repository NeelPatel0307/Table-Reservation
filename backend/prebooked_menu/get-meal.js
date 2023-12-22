const express = require("express");
const serverless = require("serverless-http")
const admin = require("firebase-admin")

const app = express();
const credentials = require("./csci-5410-b00942541-serverless-firebase-adminsdk-yogcs-730e3a88e2.json")


admin.initializeApp({
    credential:admin.credential.cert(credentials)
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const db = admin.firestore();

// Get data based on table reservation id
app.get("/get-booked-meal/reservation-id/:reservationId",function(req,res){
    var id= parseInt(req.params.reservationId);
    if(id){
        try{
            var collection = db.collection("food_order")
            var query = collection.where("table_reservation_id","==",id)
            query.get().then(data=>{
                if(data.size==0){
                    res.status(200).json({"msg":"No data found for resrvation id "+id})
                }
                else{
                    data.forEach(doc=>{
                        res.status(200).json(doc.data())
                    })
                }
            })
           
        }
        catch(error){
            res.status(500).json({"msg":"Unable to fetch the record"}).end();
        }
    }
    else{
        res.status(500).json({"msg":"Please provide the pre-booked meal id"}).end();
    }
    
})

// Get data based on table document id
app.get("/get-booked-meal/document-id/:docId",async function(req,res){
    var id= req.params.docId;
    if(id){
        try{
            var docRef = db.collection("food_order").doc(id)
            var response = await docRef.get().then(doc=>{
                if(doc.exists){
                    res.status(200).json(doc.data())
                }
                else{
                    res.status(200).json({"msg":"Invalid document id. Please specify the document id"})
                }
            })
           
        }
        catch(error){
            res.status(500).json({"msg":"Unable to fetch the record"}).end();
        }
    }
    else{
        res.status(500).json({"msg":"Please provide the pre-booked meal id"}).end();
    }
    
})

app.get("/get-booked-meal/get-all",async function(req,res){
        try{
            var docRef = db.collection("food_order")
            var response = await docRef.get()
            var result = []
            response.forEach(doc=>{
                var data = doc.data()
                result.push({
                    doc_id:doc.id,
                    ...doc.data()
                })
            })
            res.status(200).json({result:result})
        }
        catch(error){
            res.status(500).json({"msg":"Unable to fetch the record"}).end();
        }
    })

module.exports.handler = serverless(app)