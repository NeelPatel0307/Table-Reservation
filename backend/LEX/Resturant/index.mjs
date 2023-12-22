import { logger } from "./functions.mjs";

import BookingInformationIntent from "./BookingInformationIntent.mjs";
import GetOpeningIntent from "./GetOpening.mjs";
import EditTimeIntent from "./EditTime.mjs";
import ReadReviewsIntent from "./ReadReviews.mjs";
import GetLocationIntent from "./GetLocation.mjs";
import EditLocationIntent from "./EditLocation.mjs";
import GetReservationsIntent from "./GetReservations.mjs";
import UpdateReservationIntent from "./UpdateReservation.mjs";

export const handler = async (event) => {
  const slots = event["sessionState"]["intent"]["slots"];
  const intent = event["sessionState"]["intent"]["name"];
  const sessionId = event["requestAttributes"]["applicationId"];

  logger(event, slots, intent, sessionId);

  if (intent == "BookingInformation") {
    return BookingInformationIntent(event, intent, slots, sessionId);
  } else if (intent == "GetOpening") {
    return GetOpeningIntent(event, intent, slots);
  } else if (intent == "EditTime") {
    return EditTimeIntent(event, intent, slots);
  } else if (intent == "readReviews") {
    return ReadReviewsIntent(event, intent, slots);
  } else if (intent == "GetLocation") {
    return GetLocationIntent(event, intent, slots, sessionId);
  } else if (intent == "EditLocation") {
    return EditLocationIntent(event, intent, slots, sessionId);
  } else if (intent == "GetReservations") {
    return GetReservationsIntent(event, intent, slots, sessionId);
  } else if (intent == "UpdateReservation") {
    return UpdateReservationIntent(event, intent, slots, sessionId);
  }
};
