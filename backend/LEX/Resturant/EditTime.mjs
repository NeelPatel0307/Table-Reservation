import { CloseSlot, DelegateIntent, ElicitSlot } from "./functions.mjs";

const handleBookResturantIntent = async (event, intent, slots, sessionId) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    if (slots["OpenTime"] == null) {
      return ElicitSlot("OpenTime", intent, slots);
    }
    if (slots["CloseTime"] == null) {
      return ElicitSlot("CloseTime", intent, slots);
    } else {
      return DelegateIntent(intent, slots);
    }
  }

  if (event["invocationSource"] == "FulfillmentCodeHook") {
    return await CloseSlot(
      intent,
      slots,
      "The resturant timming is been updated."
    );
  }
};

export default handleBookResturantIntent;
