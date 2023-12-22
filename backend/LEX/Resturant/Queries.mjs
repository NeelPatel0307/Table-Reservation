import axios from "axios";
export const getResturants = async () => {
  const { data } = await axios.get(
    "https://m7kkjr68xi.execute-api.us-east-1.amazonaws.com/delop/restaurants"
  );
  return data;
};

export const addBooking = async (
  resturant_id,
  number_of_guests,
  date,
  time,
  sessionId
) => {
  const userData = await getUserSession(sessionId);
  const { userId } = userData.data;
  const { data } = await axios.post(
    "https://northamerica-northeast1-serverless-402317.cloudfunctions.net/add-reservation",
    {
      restaurant_id: resturant_id,
      user_id: userId,
      num_guests: number_of_guests,
      date: date,
      time: time,
      additional_req: "",
    }
  );
  return data;
};

export const getSelectedResturant = async (slots) => {
  const resturant = slots["Resturant"].value.interpretedValue;
  const resturants = await getResturants();
  const { Items } = resturants;
  const d = Items.filter((e) => e.RestaurantName.toLowerCase() == resturant)[0];
  return d;
};

export const getUserSession = async (session) => {
  const { data } = await axios.get(
    `https://pfzk3ew4qpifsjqw4brw4e6h6m0crohx.lambda-url.us-east-1.on.aws?sessionId=${session}`
  );
  return data;
};

export const getReviews = async () => {
  const { data } = await axios.get(
    "https://us-east1-cloudcomputing-389920.cloudfunctions.net/getReview"
  );
  return data;
};

export const getReservations = async () => {
  const { data } = await axios.get(
    "https://northamerica-northeast1-serverless-402317.cloudfunctions.net/get-reservation"
  );
  return data;
};

export const reservationStatusChage = async (reservation_id, status) => {
  const { data } = await axios.post(
    "https://northamerica-northeast1-serverless-402317.cloudfunctions.net/status-change",
    { reservation_id, status }
  );
  return data;
};
