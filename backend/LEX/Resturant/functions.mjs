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

export const CloseSlot = (intent, slots, messageText) => {
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
        content: messageText,
      },
    ],
  };
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

export const ElicitStatus = (intent, slots) => {
  return ElicitSlot("Status", intent, slots, [
    {
      contentType: "ImageResponseCard",
      content: "What status you want to change?",
      imageResponseCard: {
        title: "What status you want to change?",
        buttons: [
          {
            text: "Accepted",
            value: "accepted",
          },
          {
            text: "Declined",
            value: "declined",
          },
        ],
      },
    },
  ]);
};

// export const CreateBookingCloseIntent = async (intent, slots, sessionId) => {
//   const selectedResturant = await getSelectedResturant(slots);

//   const data = await addBooking(
//     selectedResturant.RestaurantID,
//     parseInt(slots["People"].value.interpretedValue),
//     slots["Date"].value.interpretedValue,
//     slots["Time"].value.interpretedValue,
//     sessionId
//   );
//   let msg = "";

//   if (data.message) {
//     msg = data.message;
//   }
//   if (data.data && data.message) {
//     msg =
//       data.message +
//       " " +
//       `Here are your reservation number : ${data.data.reservation_id}`;
//   }

//   return {
//     sessionState: {
//       dialogAction: {
//         type: "Close",
//       },
//       intent: {
//         name: intent,
//         slots: slots,
//         state: "Fulfilled",
//       },
//     },
//     messages: [
//       {
//         contentType: "PlainText",
//         content: msg ? msg : "Thanks, I have placed your table booking.",
//       },
//     ],
//   };
// };

// export const ResturantReviewCloseSlot = async (intent, slots) => {
//   return {
//     sessionState: {
//       dialogAction: {
//         type: "Close",
//       },
//       intent: {
//         name: intent,
//         slots: slots,
//         state: "Fulfilled",
//       },
//     },
//     messages: [
//       {
//         contentType: "PlainText",
//         content: "Thank you for you valuable review.",
//       },
//     ],
//   };
// };
