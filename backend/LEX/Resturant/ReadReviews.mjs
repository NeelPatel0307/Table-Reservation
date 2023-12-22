import { getReviews } from "./Queries.mjs";
import { CloseSlot } from "./functions.mjs";

const handleReadReviews = async (event, intent, slots) => {
  const reviews = await getReviews();
  let msg = "";
  const dataToSend = reviews.filter((e) => (e.resturant = "myrest"));
  dataToSend.forEach((e, i) => {
    const m = `${i + 1}. Review: ${e.review}. ${e.stars}. `;
    msg = msg + m;
  });

  if (event["invocationSource"] == "FulfillmentCodeHook") {
    return await CloseSlot(intent, slots, msg);
  }
};

export default handleReadReviews;
