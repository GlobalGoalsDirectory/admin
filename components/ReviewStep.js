import { useEffect } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Box, Divider, Typography } from "@material-ui/core";
import { useReviewStore } from "stores/reviewStore";
import ReviewTextField from "components/ReviewTextField";
import ReviewOption from "components/ReviewOption";
import ReviewActions from "components/ReviewActions";
import toTitleCase from "helpers/toTitleCase";
import {
  getReviewColorForValue,
  getReviewColorForAction,
  getPrimaryActionForValue,
} from "helpers/review";

const ReviewStep = observer(({ field, label, ...props }) => {
  const reviewStore = useReviewStore();

  const stepStore = useLocalObservable(() => ({
    ...reviewStore.getDataForField(field),
    newValue: null,
    setNewValue(value) {
      if (value === "") value = null;
      this.newValue = value;
    },
    get values() {
      return {
        storedValue: this.storedValue,
        reviewedValue: this.reviewedValue,
        extractedValue: this.extractedValue,
      };
    },
    get suggestedValue() {
      if (this.storedValue === this.reviewedValue) return this.extractedValue;

      return this.storedValue;
    },
    // The initial suggested action, either accept or keep
    get suggestedAction() {
      return getPrimaryActionForValue(this.suggestedValue, this.values);
    },
    getReviewColorForValue(value) {
      return getReviewColorForValue(value, this.values);
    },
    // The current primary action based on the newValue
    get primaryAction() {
      return getPrimaryActionForValue(this.newValue, this.values);
    },
    commit(value) {
      this.setNewValue(value);
      reviewStore.setNewValueForField({
        field,
        newValue: this.newValue,
      });
      reviewStore.nextStep();
    },
    skip() {
      reviewStore.skipField(field);
      reviewStore.nextStep();
    },
  }));

  // Set label based on dataKey, if not set
  if (label == null)
    label = field.replace("_", " ").split(" ").map(toTitleCase).join(" ");

  useEffect(() => {
    stepStore.setNewValue(stepStore.suggestedValue);

    // If there is a match between reviewed and last extracted value, no review
    // is necessary
    if (stepStore.reviewedValue === stepStore.extractedValue) return;

    reviewStore.addStep({ label, field });

    return () => reviewStore.removeStep({ field });
  }, []);

  if (reviewStore.currentField != field) return null;

  return (
    <Box display="flex" flexDirection="column" height={1}>
      <Box flexGrow="1" style={{ overflowY: "auto" }}>
        <Box padding={4}>
          <Typography variant="h2" gutterBottom>
            {label}
          </Typography>
          <Box marginTop={3}>
            <ReviewTextField
              id={field}
              label={label}
              value={stepStore.newValue}
              onChange={(event) => stepStore.setNewValue(event.target.value)}
              color={getReviewColorForAction(stepStore.primaryAction)}
              {...props}
            />
          </Box>
        </Box>
        <Divider />
        <ReviewOption
          label="Current"
          testId="current"
          optionValue={stepStore.storedValue}
          stepStore={stepStore}
        />
        <ReviewOption
          label="AI Suggestion"
          testId="ai-suggestion"
          optionValue={stepStore.extractedValue}
          stepStore={stepStore}
        />
      </Box>
      <Divider />
      <ReviewActions stepStore={stepStore} />
    </Box>
  );
});

export default ReviewStep;
