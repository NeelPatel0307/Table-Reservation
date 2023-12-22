import axios from "axios";

const apiToCall = {};

// Get static menu list for a restaurant
apiToCall.getMenuForRestaurant = (restaurant_Id,callback) => {
  var endpoint =
    "https://jteucsbludwap3ed2dglzcfk2e0cnxmz.lambda-url.us-east-1.on.aws/get-food-menu/"+restaurant_Id;
  axios
    .get(endpoint)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Add menu order
apiToCall.addOrder = (data, callback) => {
  var endpoint =
    "https://rmqwaahzii3rdros4r2mnu3eyu0milfe.lambda-url.us-east-1.on.aws/add-food-order";
  axios
    .post(endpoint, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Add menu order
apiToCall.editExistingOrder = (data, callback) => {
  var endpoint =
    "https://i6ijt44rpnwotyzemrkt77khsi0nlpkw.lambda-url.us-east-1.on.aws/update-food-order";
  axios
    .put(endpoint, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get existing orders
apiToCall.getMenuCurrentOrders = (callback) => {
  var endpoint =
    "https://z233ef7i4seoxhayvyoe6fidna0ninkn.lambda-url.us-east-1.on.aws/get-all";
  axios
    .get(endpoint)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get existing orders
apiToCall.editExistingItem = (data,callback) => {
  var endpoint =
    "https://em6k7hovkt6gofbd3fh37uwv3i0vzdpg.lambda-url.us-east-1.on.aws";
  axios
    .post(endpoint,data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get existing orders
apiToCall.deleteItem = (data,callback) => {
  var endpoint =
    "https://clnsq67jhgzvh4jtpjli6ou6rm0oufmv.lambda-url.us-east-1.on.aws";
  axios
    .post(endpoint,data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// API to verify if the user is resturant owner or not.

apiToCall.isUserResturantOwner = (data, callback) => {
  const endpoint =
    "https://tx6jwkbs2przbiagaaiifx4eye0avnvu.lambda-url.us-east-1.on.aws/";
  axios
    .post(endpoint, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => console.log(err));
};

//API to store session of lex with userId

apiToCall.setLexSession = (data, callback) => {
  const endpoint =
    "https://pfzk3ew4qpifsjqw4brw4e6h6m0crohx.lambda-url.us-east-1.on.aws";
  axios
    .post(endpoint, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => console.log(err));
};

// Add menu order
apiToCall.addFoodItem = (data, callback) => {
  var endpoint =
    "https://ldfd5hvmlmhkgjdz2ityso6w6q0frhaz.lambda-url.us-east-1.on.aws";
  axios
    .post(endpoint, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default apiToCall;
