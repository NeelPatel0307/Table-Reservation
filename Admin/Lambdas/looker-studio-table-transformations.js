import admin from 'firebase-admin';
import AWS from 'aws-sdk'
import axios from 'axios'

export const handler = async (event) => {
  const credentials = {
    "type": "service_account",
    "project_id": "csci-5410-b00942541-serverless",
    "private_key_id": "730e3a88e2819f4beadb0a6386a667d48342fdf2",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDhVfI3IxogcNUM\nqFsckVrbcSYoUNN/+1M4sse2Og5oZF/X9K1ZVaq+G9mZdIsBbzmdzHv6v8OjCmqK\nYj3YOOXdqhWzTb0eTPw3BZNL1hvRklOg97gT6VtSAZp6Y1m3deZReMfSlwA7WJRL\nU4saaJazxMiZiS23Bb+h3niLftVYO1ScIjnxSSMy13eKgPOVC6VrMAx4XMzURx5k\noQq+zu/qhZhXvt2+9f7WWvpsAwclLLRdfnZrM5iX6e2T11bjQZJj7SOJpT23KPKC\nZ1p6soqsCvqvU7LC5106C0Y0bDnS4tjVXtOS+OiUVEckNq8tI9vOMhbqRfKN17fq\nKC+Hzv0LAgMBAAECggEAF+9lLG4nbE1lPqmeDp7HToqU9FtW2+qk9bTSeeIY0wXh\nGF3+ZoAvBBqOi+T75EnIOPbA2esHVjODtZynLRHTeNmENz40BG/w/8yGejENVhQm\nRfGKNV3oPAG87Zsiqyt0LNtDfnRZAJ9xa77oBloYXT1d1tE3cJAabDs8BV/nkYN+\nI1jKvRS37RbGGMyGk4BeJkOKRTSG/uNMpBTJ1xTK0zqG/tTw+sOt1YA6vDwHmeP/\neVzhQkxUsxNVhBWk030mM7k9GSWY9bY028O7orY5LWMznGOk3SM8TSwOlkC3gHsv\n9vpqkQbonklvcKu1zR80gCJCUAlbdgpnU5IF66FB4QKBgQD19nlRneFOxNhQkbu9\nc9SHj5h7JgvvISzgdKp/8Zedw1NMPw9Ucu9ScSjAcdXzDxXSGCl+YOh4G3f3KgQv\nw1L78xNCGUho99fWREzYx8a+sSXZVQk+AyRoQP3uNGzg8rnUOr/IyYT6ZUyjH1ce\nUWb8DnNygMROAprzQfAN7lMo1wKBgQDqh/w8TI+bfDcHzXne/19cYDZqBNbdediO\nLX7hcoG7R0/t50/hXuEkMB2sTfgtnFsWV7TH0nwZM7p10mS/IjaBbDarXbqmuyF0\nO6FR2eH+jBEsjBYkHEhfBAW0GLxNzJhnbGTVHdU/uvFdh9JupuR7Wq9NlroMg/YD\nP5UwivOC7QKBgQCiuWPeCVOsZzKtax0H4//xh6DbqHowxIQKI2VBrDYgm78aLIYZ\n2shWhKLvXuCrI4nOK0oYYEisXY/qp5OJffIC2fgdvNhZCc9z5E/rA5CLTGu78zRg\nIHgPuR/GXkzCLhOfQxbq4dfmSOqA6RUb68L0cyMR1/sHmVWmJjOJI+lElQKBgQDL\npdbtWSGdxqdWPCKl8yOP5+938cnNOL9E/dZd1vs1bn/GOYPQU3212Z36fx2QJWOm\nq/PLS0b870DqjA11NjUT/q4d8V5g5r7u2dSDaWlmiaNkBiQ3qONitfBp6Myh1ZVE\nwQdxUt1X4HEzYPvlnz9oqV7tRYM52OAnA+/83bsDJQKBgFf0YzV/e/ZM7icxL/bs\nCeJY420R9XiFxKWZ5+4Cfu+QW6Ge44oU5OY1ttWoi78FoU0gy/PFFsXhTxHnneH3\nBJ5LGC4MEl4q0+Y/DEH4QEZTDIHZ4ZsIeOJdYfJLvUGm7MqOuTn+F5jl7kGQvMD7\nHWUOhbHiM528ihpZ+EknjVFn\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-yogcs@csci-5410-b00942541-serverless.iam.gserviceaccount.com",
    "client_id": "102094993712400686761",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yogcs%40csci-5410-b00942541-serverless.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  
    admin.initializeApp({
    credential: admin.credential.cert(credentials),
    databaseURL: 'https://csci-5410-b00942541-serverless.firebaseio.com',
  });
  
  const db = admin.firestore();

  var orderItems = [];
  try{
    const response = await axios.get("https://z233ef7i4seoxhayvyoe6fidna0ninkn.lambda-url.us-east-1.on.aws/get-booked-meal/get-all");
    // console.log(response.data.result)
    var result = response.data.result
    // console.log(result)
    var reservationResult = await axios.get("https://northamerica-northeast1-serverless-402317.cloudfunctions.net/get-reservation");
    var reservationResponse = reservationResult.data.data;
    await result.map(item=>{
      var currentOrderList=[];
      var reservationItem = reservationResponse.find(reserveOrder=>reserveOrder.reservation_id==item.table_reservation_id)
      if(reservationItem){
         item.order.map(food_item=>{
          currentOrderList.push({
            ...food_item,
            restaurant_id:reservationItem.restaurant_id,
            user_id:reservationItem.user_id
          })
         })
      }
      else{
           item.order.map(food_item=>(
          currentOrderList.push({
            ...food_item,
            restaurant_id:"R1",
            user_id:"u3"
          })
        ))
      }
       orderItems.push(...currentOrderList);
    })
    
    
    // Create a batch
    const batch = db.batch();
    
    // return orderItems;
    
    try{
        // Loop through the data array and add documents to the batch
    orderItems.forEach(dataItem => {
      console.log(dataItem)
      const docRef = db.collection('orders_array').doc(); // Auto-generate document ID
      batch.set(docRef, dataItem);
    });

    // Commit the batch
    await batch.commit();
      return {
        "success":"Update complete"
      }
    }
    catch(err){
      return{
        "error":"Error while making batch update"
      }
    }
    
  }
  catch(err){
      return{
        "error":"Internal server error"
      }
  }
  
};
