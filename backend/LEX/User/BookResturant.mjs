import {
  CreateBookingCloseIntent,
  DelegateIntent,
  ElicitResturant,
  ElicitSlot,
  ElicitTime,
} from "./functions.mjs";

const handleBookResturantIntent = async (event, intent, slots, sessionId) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    if (slots["City"] == null) {
      return ElicitSlot("City", intent, slots);
    }
    if (slots["Date"] == null) {
      return ElicitSlot("Date", intent, slots);
    } else if (slots["Resturant"] == null) {
      return await ElicitResturant(intent, slots);
    } else if (slots["Time"] == null) {
      return await ElicitTime(intent, slots);
    } else if (slots["People"] == null) {
      return ElicitSlot("People", intent, slots);
    } else {
      return DelegateIntent(intent, slots);
    }
  }

  if (event["invocationSource"] == "FulfillmentCodeHook") {
    return await CreateBookingCloseIntent(intent, slots, sessionId);
  }
};

export default handleBookResturantIntent;
