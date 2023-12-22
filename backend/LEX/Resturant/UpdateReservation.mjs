import {
  CloseSlot,
  DelegateIntent,
  ElicitSlot,
  ElicitStatus,
} from "./functions.mjs";
import { getReservations, reservationStatusChage } from "./Queries.mjs";

const getData = async () => {
  const { data } = await getReservations();
  return data.filter((e) => e.restaurant_id == "R2");
};

const handleUpdateResturantLocation = async (
  event,
  intent,
  slots,
  sessionId
) => {
  if (event["invocationSource"] == "DialogCodeHook") {
    if (slots["Reservation"] == null) {
      const filteredData = await getData();
      let message = "";

      filteredData.forEach((element, i) => {
        const msg = `No: ${i + 1}. Date: ${element?.date} Status: ${
          element?.status
        } ${element.time ? "Time: " + element.time : ""} ${
          element.table_ids[0] ? "Table ID: " + element.table_ids[0] : ""
        } `;
        message = message + msg;
      });

      return ElicitSlot("Reservation", intent, slots, [
        {
          contentType: "PlainText",
          content: message,
        },
        {
          contentType: "PlainText",
          content: "Can i get the No for reservation?",
        },
      ]);
    } else if (slots["Status" == null]) {
      console.log(ElicitStatus(intent, slots));
      return ElicitStatus(intent, slots);
    } else {
      return DelegateIntent(intent, slots);
    }
  }

  if (event["invocationSource"] == "FulfillmentCodeHook") {
    const filteredData = await getData();
    const data = filteredData[slots["Reservation"].value.originalValue];
    const status = slots["Status"].value.originalValue;
    const a = await reservationStatusChage(data.reservation_id, status);
    console.log(a);
    return await CloseSlot(
      intent,
      slots,
      "Reservation Status is been updated."
    );
  }
};

export default handleUpdateResturantLocation;
