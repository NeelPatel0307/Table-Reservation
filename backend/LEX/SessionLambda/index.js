const { findUserBySessionId, addUserToLexSession } = require("./Queries.js");
const response = (statusCode, body) => {
  return {
    statusCode,
    body,
  };
};

exports.handler = async (event) => {
  console.log(event);
  const { body, requestContext } = event;
  const { http } = requestContext;

  if (http.method == "GET") {
    const { queryStringParameters } = event;
    const { sessionId } = queryStringParameters;
    const data = await findUserBySessionId(sessionId);
    if (data) {
      return response(200, { success: true, data });
    } else {
      return response(200, {
        success: false,
        message: "No user found with session id.",
      });
    }
  } else {
    const { userId, sessionId } = JSON.parse(body);
    console.log(body, sessionId, userId);
    if (!userId || !sessionId) {
      return response(200, {
        success: false,
        message: "userId and sessionId are required",
      });
    }
    await addUserToLexSession(sessionId, userId);
    return response(200, { success: true });
  }
};
