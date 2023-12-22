const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Credentials": true,
  };
  
  const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return `${hours}:${minutes}`;
};

const isRestaurantOpen = (restaurant) => {
  const currentTime = getCurrentTime();
  const [currentHour, currentMinute] = currentTime.split(':').map(Number);

  const [openingHour, openingMinute] = restaurant.OpeningHours.split(':').map(Number);
  const [closingHour, closingMinute] = restaurant.ClosingHours.split(':').map(Number);

  console.log('Current Time:', currentTime);
  console.log('Opening Time:', restaurant.OpeningHours);
  console.log('Closing Time:', restaurant.ClosingHours);

  // Compare the current time with opening and closing hours
  if (
    currentHour > openingHour ||
    (currentHour === openingHour && currentMinute >= openingMinute)
  ) {
    if (
      currentHour < closingHour ||
      (currentHour === closingHour && currentMinute <= closingMinute)
    ) {
      console.log('Restaurant is open');
      return true; // Restaurant is open
    }
  }

  console.log('Restaurant is closed');
  return false; // Restaurant is closed
};



  try {
    console.info("Received event:", JSON.stringify(event, null, 2));

    switch (event.httpMethod + " " + event.resource) {
     
       
      case "PUT /restaurants/updateTiming/{id}":
 let updatedRestaurantId = event.pathParameters.id;
  const requestBody = JSON.parse(event.body);

  console.log("Received PUT request for updating hours. Restaurant ID:", updatedRestaurantId);
  console.log("Request body:", JSON.stringify(requestBody, null, 2));

  // Validate the request body
  if (!requestBody.OpeningHours || !requestBody.ClosingHours) {
    console.error("Invalid request body. Both opening and closing hours are required.");
    throw new Error("Both opening and closing hours are required.");
  }

  console.log("Closing hours value:", requestBody.ClosingHours);

  // Update the hours in the DynamoDB table
  await dynamo
    .update({
      TableName: "Restaurants",
      Key: {
        RestaurantID: updatedRestaurantId,
      },
      UpdateExpression: "SET #OpeningHours = :openingHours, #ClosingHours = :closingHours",
      ExpressionAttributeNames: {
        "#OpeningHours": "OpeningHours",
        "#ClosingHours": "ClosingHours", 
      },
      ExpressionAttributeValues: {
        ":openingHours": requestBody.OpeningHours,
        ":closingHours": requestBody.ClosingHours,
      },
    })
    .promise();
    
 body = { message: "Opening and closing hours updated successfully.", isOpen: isRestaurantOpen(body) };
  break;

      // If no route found, output an error message
      default:
        throw new Error(
          `Unsupported route: "${event.httpMethod + " " + event.resource}"`
        );
    }
  } catch (err) {
    statusCode = 400;
    body = { error: err.message };
    console.error("Error:", err.message);
  }

  return {
    isBase64Encoded: false,
    statusCode,
    headers,
    body: JSON.stringify(body || {}),
  };
};
