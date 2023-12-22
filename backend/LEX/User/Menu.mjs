import { getMenu, getResturants } from "./Queries.mjs";
import { CloseSlot, ElicitResturant } from "./functions.mjs";

const handleResturantMenuIntent = async (event, intent, slots, sessionId) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    if (slots["Resturant"] == null) {
      return ElicitResturant(intent, slots);
    } else {
      const resturants = await getResturants();
      const data = resturants.Items.filter(
        (e) => e.RestaurantName == slots["Resturant"].value.originalValue
      )[0];
      const menu = await getMenu(data.RestaurantID);
      const menuData = menu.data;

      let message = "";

      menuData.slice(0, 10).forEach((element, i) => {
        const msg = `${i + 1}. Name: ${element?.name} Price: ${element?.price}`;
        message = message + msg;
      });

      return await CloseSlot(intent, slots, [
        {
          contentType: "PlainText",
          content: `Following is the menu`,
        },
        {
          contentType: "PlainText",
          content: message,
        },
      ]);
    }
  }
};
export default handleResturantMenuIntent;
