import { getResturants } from "./Queries.mjs";
import { CloseSlot, ElicitResturant } from "./functions.mjs";

const handleResturantReviewIntent = async (event, intent, slots, sessionId) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    if (slots["Resturant"] == null) {
      return ElicitResturant(intent, slots);
    } else {
      const resturants = await getResturants();
      const data = resturants.Items.filter(
        (e) => e.RestaurantName == slots["Resturant"].value.originalValue
      )[0];
      return await CloseSlot(intent, slots, [
        {
          contentType: "PlainText",
          content: `The resturant is address is following: ${data.Address}`,
        },
      ]);
    }
  }
};
export default handleResturantReviewIntent;
