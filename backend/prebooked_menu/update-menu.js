const admin = require("firebase-admin");
const express = require("express");
const serverless = require("serverless-http")

const app = express();

const credentials = require("./csci-5410-b00942541-serverless-firebase-adminsdk-yogcs-730e3a88e2.json")


admin.initializeApp({
    credential:admin.credential.cert(credentials)
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const db = admin.firestore();

app.put("/update-food-order",async function(req,res){
    /*
    Pending lists:
        - Update based on reservation id
        - Update if quantity is greator 0
    */ 
        var body = req.body;
    var docId = body.doc_id?body.doc_id:null;
    var updatedOrder = body.updated_order?body.updated_order:[];
   
    var body = req.body;

    // Check for a request body
    if(docId && docId.length>0){
        try{
            
            var docRef = db.collection("food_order").doc(docId)
            await docRef.get().then(doc=>{
                if(doc.exists){
                    if(updatedOrder.length==0){
                        res.status(200).json({"error":"Updated orer list is empty"})
                    }
                    else{
                        var data = doc.data();
                        data.order = updatedOrder;
                       var response = db.collection("food_order").doc(docId).set(data);
                       res.status(200).json({"msg":"Order updated",docId:docId})
                    }
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
        res.status(500).json({"error":"Missing doc id"}).end();
    }
    
})

// app.listen(3000,()=>{
//     console.log("Port listening on 3000")
// })

module.exports.handler = serverless(app)

