import { logger } from "./functions.mjs";
import handleResturantReviewIntent from "./ResturantReview.mjs";
import handleBookResturantIntent from "./BookResturant.mjs";
import handleLocationInformationIntent from "./LocationInformation.mjs";
import handleResturantOpeningTimes from "./OpeningTimes.mjs";
import handleResturantMenu from "./Menu.mjs";

export const handler = async (event) => {
  const slots = event["sessionState"]["intent"]["slots"];
  const intent = event["sessionState"]["intent"]["name"];
  const sessionId = event["requestAttributes"]["applicationId"];

  logger(event, slots, intent, sessionId);

  if (intent == "BookResturant") {
    return handleBookResturantIntent(event, intent, slots, sessionId);
  } else if (intent == "ResturantReview") {
    return handleResturantReviewIntent(event, intent, slots, sessionId);
  } else if (intent == "LocationInformation") {
    return await handleLocationInformationIntent(
      event,
      intent,
      slots,
      sessionId
    );
  } else if (intent == "OpeningTimes") {
    return await handleResturantOpeningTimes(event, intent, slots, sessionId);
  } else if (intent == "Menu") {
    return await handleResturantMenu(event, intent, slots, sessionId);
  }
};
