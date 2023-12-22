import { getReservations } from "./Queries.mjs";
import { CloseSlot } from "./functions.mjs";

const handleGetResarvationsIntent = async (event, intent, slots) => {
  const { data } = await getReservations();
  const filteredData = data.filter((e) => e.restaurant_id == "R2");
  let message = "";

  filteredData.forEach((element, i) => {
    const msg = `${i + 1}. Date: ${element?.date} Status: ${element?.status} ${
      element.time ? "Time: " + element.time : ""
    } ${element.table_ids[0] ? "Table ID: " + element.table_ids[0] : ""} `;
    message = message + msg;
  });

  if (event["invocationSource"] == "DialogCodeHook") {
    return await CloseSlot(intent, slots, message);
  }
};

export default handleGetResarvationsIntent;
