const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const docClient = new AWS.DynamoDB.DocumentClient();

const findUsersById = async (userId) => {
  const params = {
    TableName: "resturantowners",
    Key: {
      userId: userId,
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

exports.handler = async (event) => {
  const { body } = event;
  const { userId } = JSON.parse(body);

  if (!userId) {
    return response(200, { success: false, message: "userId is required." });
  }

  const data = await findUsersById(userId);
  if (data) {
    return response(200, { success: true, data });
  } else {
    return response(200, {
      success: false,
      message: "User is not Resturant Owner.",
    });
  }
};

const response = (statusCode, body) => {
  return {
    statusCode,
    body,
  };
};
