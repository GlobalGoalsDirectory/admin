import {
  green,
  orange,
  red,
  blue,
  grey as gray,
} from "@material-ui/core/colors";
import {
  CheckBold,
  CloseThick,
  Circle,
  LeadPencil,
  SkipNext,
} from "mdi-material-ui";

const ACTIONS = {
  ACCEPT: {
    color: green[600],
    icon: <CheckBold />,
  },
  REJECT: {
    color: red[700],
    icon: <CloseThick />,
  },
  MODIFY: {
    color: orange[600],
    icon: <LeadPencil />,
  },
  KEEP: {
    color: blue[500],
    icon: <CheckBold />,
  },
  SKIP: {
    color: gray[500],
    icon: <SkipNext />,
  },
  PENDING: {
    color: gray[500],
    icon: <Circle />,
  },
};

// Return true if field is reviewable by user
// This can be used to ensure that only permitted/whitelisted fields have been
// provided by the user
export const isReviewableField = (field) =>
  [
    "name",
    "homepage",
    "about",
    "address",
    "latitude",
    "longitude",
    "facebook_handle",
    "twitter_handle",
    "linkedin_handle",
  ].includes(field);

export const getPrimaryActionForValue = (
  value,
  { storedValue, reviewedValue, extractedValue }
) => {
  if (value === extractedValue) return "ACCEPT";
  if (value === reviewedValue && value === storedValue) return "REJECT";
  if (value === storedValue) return "KEEP";

  return "MODIFY";
};

export const getReviewColorForValue = (...args) =>
  getReviewColorForAction(getPrimaryActionForValue(...args));

export const getReviewColorForAction = (action) => ACTIONS[action].color;
export const getReviewIconForAction = (action) => ACTIONS[action].icon;
