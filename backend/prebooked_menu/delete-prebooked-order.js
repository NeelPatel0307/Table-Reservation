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

// Get data based on table document id
app.delete("/delete-booked-meal/document-id/:docId",async function(req,res){
    var id= req.params.docId;
    if(id){
        try{
            var docRef = db.collection("food_order").doc(id)
            await docRef.get().then((doc)=>{
                if(doc.exists){
                    docRef.delete().then(()=>{
                        res.status(200).json({"msg":"Successfully deleted the data"})
                    }).catch(err=>{
                        res.status(200).json({"error":"Falied to delete the order"})
                    })
                }
                else{
                    res.status(200).json({"error":"Order does not exist"})
                }
            })
           
        }
        catch(error){
            res.status(500).json({"error":"Unable to fetch the record to delete the order"}).end();
        }
    }
    else{
        res.status(500).json({"error":"Please provide the pre-booked meal id"}).end();
    }
    
})




module.exports.handler = serverless(app)