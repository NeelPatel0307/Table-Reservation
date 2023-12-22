import { writeReview } from "./Queries.mjs";
import {
  ElicitSlot,
  DelegateIntent,
  ElicitRatings,
  ResturantReviewCloseSlot,
  ElicitResturant,
} from "./functions.mjs";
import { v4 } from "uuid";

const handleResturantReviewIntent = async (event, intent, slots, sessionId) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    if (slots["Resturant"] == null) {
      return ElicitResturant(intent, slots);
    } else if (slots["Ratings"] == null) {
      return await ElicitRatings(intent, slots);
    } else if (slots["Review"] == null) {
      return ElicitSlot("Review", intent, slots);
    } else {
      return DelegateIntent(intent, slots);
    }
  }
  if (event["invocationSource"] == "FulfillmentCodeHook") {
    const id = v4();
    const resturant = slots["Resturant"].value.originalValue;
    const review = slots["Review"].value.originalValue;
    const ratings = slots["Ratings"].value.originalValue;
    const d = await writeReview(resturant, id, ratings, review);
    console.log(d);
    return await ResturantReviewCloseSlot(intent, slots);
  }
};

export default handleResturantReviewIntent;
