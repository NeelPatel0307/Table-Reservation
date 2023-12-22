import { CloseSlot } from "./functions.mjs";

const handleGetLocationIntent = async (event, intent, slots) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    return await CloseSlot(intent, slots, `Location of resturant is: .`);
  }
};

export default handleGetLocationIntent;
