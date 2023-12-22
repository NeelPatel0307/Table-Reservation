const AWS = require('aws-sdk');

// Create a DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient(); // Use DocumentClient for easier JSON handling

module.exports.handler = async (event) => {
  var body = JSON.parse(event.body);
  const tableName = 'food-menu-table';
  const primaryKeyValue = body.item_id;
  console.log(primaryKeyValue)

  // Specify the new values for the entire row
  const updatedValues = {
    'item_id': primaryKeyValue,
    'restaurant_id': body.restaurant_id,
    'category': body.category,
    'description': body['description'],
    'name': body['name'],
    'price': body.price
  };

  // Define the parameters for the update operation
  const updateParams = {
    TableName: tableName,
    Key: {
      'item_id': primaryKeyValue,
      "restaurant_id":body.restaurant_id
    },
    UpdateExpression: 'SET',
    ExpressionAttributeValues: {},
     ExpressionAttributeNames: {},
    ReturnValues: 'ALL_NEW' // Optional, to get the updated item in the response
  };

  // Populate UpdateExpression and ExpressionAttributeValues with the new values
  Object.keys(updatedValues).forEach(attributeName => {
    if(attributeName!="item_id" && attributeName!="restaurant_id"){
        updateParams.UpdateExpression += ` #${attributeName} = :${attributeName},`;
      updateParams.ExpressionAttributeValues[`:${attributeName}`] = updatedValues[attributeName];
      updateParams.ExpressionAttributeNames[`#${attributeName}`] = attributeName;
    }
   
  });

  // Remove the trailing comma from UpdateExpression
  updateParams.UpdateExpression = updateParams.UpdateExpression.slice(0, -1);

  try {
    // Use the update method to update the entire row
      const data = await dynamodb.update(updateParams).promise();
      console.log(`Row with primary key ${primaryKeyValue} updated successfully. Updated item:`, data.Attributes);
      return {'success':"Updated the data","updatedItems": data.Attributes}
  } catch (error) {
      return {"err":"Failed to update the itmes"}
  }
};
