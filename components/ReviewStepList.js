import { observer } from "mobx-react-lite";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { useReviewStore } from "stores/reviewStore";
import {
  getReviewColorForAction,
  getReviewIconForAction,
} from "helpers/review";

const getTextColor = ({ field, currentField, reviewStore }) => {
  if (field === currentField) return "primary.contrastText";

  if (
    !reviewStore.doesFieldNeedReview(field) &&
    !reviewStore.hasFieldBeenReviewed(field)
  )
    return "#959393";

  return null;
};

const ReviewStepList = observer(() => {
  const reviewStore = useReviewStore();
  const currentField = reviewStore.currentField;
  const setCurrentField = reviewStore.setCurrentField;
  const getCommittedActionForField = reviewStore.getCommittedActionForField;

  return (
    <List>
      {reviewStore.steps.map(({ field, label }) => (
        <Box
          key={field}
          bgcolor={field === currentField ? "primary.main" : null}
          color={getTextColor({ field, currentField, reviewStore })}
          clone
        >
          <ListItem
            button={field != currentField}
            onClick={() => setCurrentField(field)}
          >
            <ListItemIcon style={{ minWidth: 40 }}>
              <Box
                color={
                  field === currentField
                    ? "primary.contrastText"
                    : getReviewColorForAction(getCommittedActionForField(field))
                }
                clone
              >
                {getReviewIconForAction(getCommittedActionForField(field))}
              </Box>
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        </Box>
      ))}
    </List>
  );
});

export default ReviewStepList;
