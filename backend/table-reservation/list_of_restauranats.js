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
      // GET All Restaurants
case "GET /restaurants":
  body = await dynamo.scan({ TableName: "Restaurants" }).promise();
  
  if (body.Items && Array.isArray(body.Items)) {
    body.Items = body.Items.map((restaurant) => ({
      ...restaurant,
      isOpen: isRestaurantOpen(restaurant),
    }));
  } else {
    body = { error: "Failed to fetch restaurant data" };
    statusCode = 400;
  }
  break;


      // Get a single restaurant by id
      case "GET /restaurants/{id}":
        const restaurantId = event.pathParameters.id;
        console.log("Received restaurant ID:", restaurantId);

        if (!restaurantId) {
          throw new Error("Path parameter 'id' is missing.");
        }

        body = await dynamo
          .get({
            TableName: "Restaurants",
            Key: {
              RestaurantID: restaurantId,
            },
          })
          .promise();
 body.Item.isOpen = isRestaurantOpen(body.Item);
        console.log("Retrieved data:", JSON.stringify(body, null, 2));
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
