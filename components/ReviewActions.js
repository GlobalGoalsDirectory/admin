import { observer } from "mobx-react-lite";
import { Box, Button } from "@material-ui/core";
import { CheckboxMarkedCircle } from "mdi-material-ui";
import { getReviewColorForAction } from "helpers/review";

const ACCEPT = {
  id: "ACCEPT",
  label: "Accept",
  onClick: (stepStore) => stepStore.commit(stepStore.extractedValue),
};

const REJECT = {
  id: "REJECT",
  label: "Reject",
  onClick: (stepStore) => stepStore.commit(stepStore.storedValue),
};

const SKIP = {
  id: "SKIP",
  label: "Skip",
  onClick: (stepStore) => stepStore.skip(),
};

const KEEP = {
  id: "KEEP",
  label: "Keep modification",
  onClick: (stepStore) => stepStore.commit(stepStore.storedValue),
};

const MODIFY = {
  id: "MODIFY",
  label: "Save",
  onClick: (stepStore) => stepStore.commit(stepStore.newValue),
};

const getAvailableActions = (stepStore) => {
  if (stepStore.primaryAction === "IGNORE") return [SKIP];

  if (
    stepStore.primaryAction === "ACCEPT" &&
    stepStore.suggestedAction === "ACCEPT" &&
    // Reject action does not make sense when storedValue is equal to
    // extractedValue (reject action commits storedValue, which is equal to
    // extractedValue, which is equal to accept action)
    stepStore.storedValue != stepStore.extractedValue
  )
    return [ACCEPT, REJECT, SKIP];

  if (stepStore.primaryAction === "ACCEPT") return [ACCEPT, SKIP];

  if (stepStore.primaryAction === "REJECT") return [REJECT, SKIP];

  if (stepStore.primaryAction === "KEEP") return [KEEP, SKIP];

  if (stepStore.primaryAction === "MODIFY") return [MODIFY, SKIP];
};

const ReviewActions = observer(({ stepStore }) => (
  <Box paddingX={4} paddingY={2} display="flex" justifyContent="flex-end">
    {getAvailableActions(stepStore).map(({ id, label, onClick }) => (
      <Box key={id} marginLeft={1}>
        <Button
          color="primary"
          variant="contained"
          style={{ background: getReviewColorForAction(id) }}
          onClick={() => onClick(stepStore)}
        >
          {label}
        </Button>
      </Box>
    ))}
  </Box>
));

export default ReviewActions;
