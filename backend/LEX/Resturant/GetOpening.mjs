import { CloseSlot } from "./functions.mjs";

const handleBookResturantIntent = async (event, intent, slots) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    return await CloseSlot(
      intent,
      slots,
      `Timming for your restuant is from 12:00 to 22:00.`
    );
  }
};

export default handleBookResturantIntent;
