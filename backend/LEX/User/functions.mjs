import { addBooking, getResturants, getSelectedResturant } from "./Queries.mjs";

export const logger = (event, slots, intent, sessionId) => {
  console.log("Event", JSON.stringify(event));
  console.log("invocation", event["invocationSource"]);
  console.log("slots", JSON.stringify(slots));
  console.log("intent", JSON.stringify(intent));
  console.log("Session Id", sessionId);
};

export const ElicitSlot = (name, intent, slots, messages) => {
  return {
    sessionState: {
      dialogAction: {
        slotToElicit: name,
        type: "ElicitSlot",
      },
      intent: {
        name: intent,
        slots: slots,
      },
    },
    messages,
  };
};

export const ElicitResturant = async (intent, slots) => {
  const resturants = await getResturants();
  const { Items } = resturants;

  return ElicitSlot("Resturant", intent, slots, [
    {
      contentType: "PlainText",
      content: "Here is the list of resturants. Can you select the resturant ?",
    },
    {
      contentType: "ImageResponseCard",
      content: "Here is the list of resturants:Can you select the resturant ?",
      imageResponseCard: {
        title: "Resturants",
        subtitle: "Can you select resturant?",
        buttons: Items.map((it) => ({
          text: it.RestaurantName,
          value: it.RestaurantName,
        })),
      },
    },
  ]);
};

export const ElicitTime = async (intent, slots) => {
  const selectedResturant = await getSelectedResturant(slots);
  return ElicitSlot("Time", intent, slots, [
    {
      contentType: "PlainText",
      content: `The resturant is open from ${selectedResturant.OpeningHours} to ${selectedResturant.ClosingHours}. Please select a time for reservation.`,
    },
  ]);
};

export const DelegateIntent = (intent, slots) => {
  return {
    sessionState: {
      dialogAction: {
        type: "Delegate",
      },
      intent: {
        name: intent,
        slots: slots,
      },
    },
  };
};

export const CreateBookingCloseIntent = async (intent, slots, sessionId) => {
  const selectedResturant = await getSelectedResturant(slots);

  const data = await addBooking(
    selectedResturant.RestaurantID,
    parseInt(slots["People"].value.interpretedValue),
    slots["Date"].value.interpretedValue,
    slots["Time"].value.interpretedValue,
    sessionId
  );
  let msg = "";

  if (data.message) {
    msg = data.message;
  }
  if (data.data && data.message) {
    msg =
      data.message +
      " " +
      `Here are your reservation number : ${data.data.reservation_id}`;
  }

  return {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: intent,
        slots: slots,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: msg ? msg : "Thanks, I have placed your table booking.",
      },
    ],
  };
};

export const ElicitRatings = (intent, slots) => {
  return ElicitSlot("Ratings", intent, slots, [
    {
      contentType: "ImageResponseCard",
      content: "Can you give rating for the resturant?",
      imageResponseCard: {
        title: "Please rate",
        subtitle: "Select from 1 to 5.",
        buttons: Array.from({ length: 5 }, (i, j) => ({
          text: j + 1,
          value: j + 1,
        })),
      },
    },
  ]);
};

export const CloseSlot = (intent, slots, messages) => {
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: intent,
        slots: slots,
        state: "Fulfilled",
      },
    },
    messages,
  };
};

export const ResturantReviewCloseSlot = async (intent, slots) => {
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: intent,
        slots: slots,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: "Thank you for you valuable review.",
      },
    ],
  };
};
