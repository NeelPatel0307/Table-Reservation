const AWS = require("aws-sdk")

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  // var body = JSON.parse(event.body)
  var body = event;
  var item_id = body.item_id;
  var restaurant_id = body.restaurant_id;
  var type = body.type;
  var value = body.value;
  var isGlobal = body.isGlobal;
  
   // get existing offer
     const getParams = {
            TableName: 'food-menu-table', 
            FilterExpression: 'item_id = :value', 
            ExpressionAttributeValues: {
              ':value': item_id, 
            },
        };
        
        try{
          var response = await dynamodb.scan(getParams).promise()
          var responseItem = response.Items[0];
          console.log(response.Items)
          var currentOffers = isGlobal?responseItem.global_offers:responseItem.offers;
          currentOffers.push({
            "type":type,
            "value":value
          })
          
          var columnToUpdate = isGlobal?"global_offers":"offers";
          
          const updateParams = {
            TableName: "food-menu-table",
            Key: {
              'item_id': item_id,
              'restaurant_id':restaurant_id
            },
            UpdateExpression: `SET #${columnToUpdate} = :newValue`,
            ExpressionAttributeNames: {
            //   `#newValue`: 'yourAttributeName',
            // },
            // ExpressionAttributeValues: {
            //   ':newValue': 'new value',
            },
            ReturnValues: 'ALL_NEW', // Specify the return values if needed
          };
                  
        }
        catch(err){
          return {"err":"Error occured"}
        }
};
