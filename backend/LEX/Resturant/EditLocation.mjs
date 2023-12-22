import { CloseSlot, DelegateIntent, ElicitSlot } from "./functions.mjs";

const handleUpdateResturantLocation = async (
  event,
  intent,
  slots,
  sessionId
) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    if (slots["Address"] == null) {
      return ElicitSlot("Address", intent, slots);
    } else {
      return DelegateIntent(intent, slots);
    }
  }

  if (event["invocationSource"] == "FulfillmentCodeHook") {
    return await CloseSlot(
      intent,
      slots,
      "Resturant Location is been updated."
    );
  }
};

export default handleUpdateResturantLocation;
