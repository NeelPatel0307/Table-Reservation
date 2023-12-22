const axios = require("axios");

module.exports.handler = async (event) => {
    const currentDate = new Date();
    const options = {
      timeZone: 'America/Halifax',
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
    };
    
    var orders = [];

    const unFormattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    const formattedTime = unFormattedDate.split(",")[1];
    var tempDate = unFormattedDate.split(",")[0];
    const formattedDate = tempDate.split("/")[2] + "-" + tempDate.split("/")[0] + "-" + tempDate.split("/")[1];
    console.log(tempDate)
    console.log(formattedDate)
    try {
      var response = await axios.get("https://northamerica-northeast1-serverless-402317.cloudfunctions.net/get-reservation");
      var data = response.data.data;
      
      const axiosRequests = await Promise.all(data.map(async (item) => {
      if (item.date == formattedDate && ((parseInt(item.time.split("-")[0].split(":")[0]) >= parseInt(formattedTime)-4) && (parseInt(item.time.split("-")[0].split(":")[0]) <= parseInt(formattedTime)))) {
        // if (item.date == "2023-10-27" && ((parseInt(item.time.split("-")[0].split(":")[0]) >= 15) && (parseInt(item.time.split("-")[0].split(":")[0]) <= 20))) {
        // if(item.restaurant_id=="R2"){
          var reservationResponse = await axios.get("https://z233ef7i4seoxhayvyoe6fidna0ninkn.lambda-url.us-east-1.on.aws/get-booked-meal/reservation-id/"+item.reservation_id);
          console.log(reservationResponse.data)
          var foodOrderData = reservationResponse.data;
          if(foodOrderData["order"]){
            var index = orders.findIndex(order=>order.restaurant_id==item.restaurant_id)
            if(index>-1){
              for(const firestoreOrder of foodOrderData["order"]){
                  orders[index] = await performComparision(orders[index],firestoreOrder)
              }
            }
            else{
              var newRestaurant = {
                restaurant_id:item.restaurant_id,
                items:[...foodOrderData['order']]
              }
              orders.push(newRestaurant);
            }
          }
      }
    }));
    // console.log(axiosRequests);
    var top3Orders = await Promise.all(orders.map(async (order)=>{
      var items = order.items.sort((item1,item2)=>{return item2.quantity-item1.quantity});
      order["items"] = items.length>3?items.splice(0,3):items;
      return order
    }))
    
    
    const topMenuNotificationResponse =await Promise.all( top3Orders.map(async (order)=>{
      console.log(order.restaurant_id)
      console.log(`Your top 3 most ordered dishes over past 4 hours are ${JSON.stringify(order.items)}`)
      const dataToSend = {
            "topicName": order.restaurant_id,
            "message": `Your top 3 most ordered dishes over past 4 hours are ${JSON.stringify(order.items)}`,
            "subject": "Top 3 dishes",
          };
  
          try {
            const res = await axios.post("https://43exwqj5ssjfmnwdfvuz3f46qu0eqdzm.lambda-url.us-east-1.on.aws/", dataToSend);
            return res.data;
          }
          catch(err){
            return {"err":"Unable to send the notification"}
          }
    }))
   
    return {"res":topMenuNotificationResponse}
      
    }
    catch(err){
      return ({"err":"Error"})
    }
  
};

async function performComparision(orders,item){
  var items = orders.items;
  var index = items.findIndex(foodItem=>foodItem.item_id==item.item_id)
  if(index>-1){
    items[index].quantity+=item.quantity;
   
  }
  else{
    items.push(item)
    
  }
   orders["items"] = items;
  return orders;
}
