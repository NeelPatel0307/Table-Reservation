const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const docClient = new AWS.DynamoDB.DocumentClient();

const findUserBySessionId = async (sessionId) => {
  const params = {
    TableName: "lexSession",
    Key: {
      sessionId: sessionId,
    },
  };

  return new Promise((resolve, reject) => {
    docClient.get(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item);
      }
    });
  });
};

const addUserToLexSession = async (sessionId, userId) => {
  return await docClient
    .put({
      TableName: "lexSession",
      Item: {
        sessionId,
        userId,
      },
    })
    .promise();
};

module.exports = { findUserBySessionId, addUserToLexSession };
