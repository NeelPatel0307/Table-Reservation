const axios = require('axios');

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

  const unFormattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
  const formattedTime = unFormattedDate.split(",")[1];
  var tempDate = unFormattedDate.split(",")[0];
  const formattedDate = tempDate.split("/")[2] + "-" + tempDate.split("/")[0] + "-" + tempDate.split("/")[1];

  try {
    var response = await axios.get("https://northamerica-northeast1-serverless-402317.cloudfunctions.net/get-reservation");
    var data = response.data.data;
    const axiosRequests = data.map(async (item) => {
      if (item.date == formattedDate && ((item.time.split("-")[0].split(":")[0] == formattedTime) || (item.time.split("-")[0].split(":")[0] == (parseInt(formattedTime)+1).toString()))) {
        var reservationResponse = await axios.get("https://z233ef7i4seoxhayvyoe6fidna0ninkn.lambda-url.us-east-1.on.aws/reservation-id/6");
        var foodOrderData = reservationResponse.data;
        if (item.time.split("-")[0].split(":")[0] == "16" && foodOrderData["order"]) {
          console.log("Entered")
          const dataToSend = {
            "topicName": item.restaurant_id,
            "message": `Table ${item.table_ids.toString()} are booked by ${item.user_id} for the slot ${item.time}. Food order for the table is ${foodOrderData["order"].toString()}`,
            "subject": "Booking reminder",
            "endPoint": "bh626198@dal.ca"
          };
          
          console.log(dataToSend)

          try {
            const res = await axios.post("https://43exwqj5ssjfmnwdfvuz3f46qu0eqdzm.lambda-url.us-east-1.on.aws/", dataToSend);
            return {
              "res": {
                ...res.data,
                "restaurant_id": item.restaurant_id,
                "time": item.time
              }
            };
          } catch (err) {
            return {
              err: {
                "error": "Email not sent",
                "restaurant_id": item.restaurant_id,
                "time": item.time
              }
            };
          }
        } else if (item.time.split("-")[0].split(":")[0] == "15" && foodOrderData["msg"]) {
          const dataToSend = {
            "topicName": item.restaurant_id,
            "message": `Table ${item.table_ids.toString()} are booked by ${item.user_id} for the slot ${item.time}`,
            "subject": "Booking reminder",
            "endPoint": "bh626198@dal.ca"
          };
          console.log(dataToSend)

          try {
            const res = await axios.post("https://43exwqj5ssjfmnwdfvuz3f46qu0eqdzm.lambda-url.us-east-1.on.aws/", dataToSend);
            return {
              "res": {
                ...res.data,
                "restaurant_id": item.restaurant_id,
                "time": item.time
              }
            };
          } catch (err) {
            return {
              err: {
                "error": "Email not sent",
                "restaurant_id": item.restaurant_id,
                "time": item.time
              }
            };
          }
        } else {
          // Skip
          // -Either later reservation do not have a food order
          //- 10 mins notification was already notified because of the food order
          return null; // Return null for skipped items
        }
      }
      return null; // Return null for items that don't match the condition
    });

    const results = await Promise.all(axiosRequests.filter(result => result !== null)); // Filter out null results
    return { "res": results };
  } catch (err) {
    return { "err": err };
  }
};

