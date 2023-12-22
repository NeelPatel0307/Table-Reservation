import { ElicitSlot, CloseSlot } from "./functions.mjs";

const handleBookResturantIntent = async (event, intent, slots) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    if (slots["Time"] == null) {
      return ElicitSlot("Time", intent, slots);
    } else {
      return await CloseSlot(
        intent,
        slots,
        `You have 3 reservations for ${slots["Time"].value.interpretedValue}`
      );
    }
  }
};

export default handleBookResturantIntent;
