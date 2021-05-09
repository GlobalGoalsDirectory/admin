import { useEffect } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Box, Divider, Typography } from "@material-ui/core";
import { useReviewStore } from "stores/reviewStore";
import ReviewInput from "components/ReviewInput";
import ReviewOption from "components/ReviewOption";
import ReviewActions from "components/ReviewActions";
import toTitleCase from "helpers/toTitleCase";
import {
  getReviewColorForValue,
  getPrimaryActionForValue,
} from "helpers/review";

const ReviewStep = observer(
  ({ field, label, type = "string", reviewOptions = [] }) => {
    const reviewStore = useReviewStore();

    const stepStore = useLocalObservable(() => ({
      ...reviewStore.getDataForField(field),
      newValue: null,
      fieldType: type,
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
        return reviewStore.getSuggestedValueForField(field);
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
      reviewStore.addStep({ label, field });

      return () => reviewStore.removeStep({ field });
    }, []);

    if (reviewStore.currentField != field) return null;

    return (
      <Box display="flex" flexDirection="column" height={1}>
        <Box flexGrow="1" style={{ overflowY: "auto" }}>
          <Box marginX={4} marginTop={4} marginBottom={3}>
            <Typography variant="h2" gutterBottom>
              {label}
            </Typography>
          </Box>
          <ReviewInput field={field} label={label} stepStore={stepStore} />
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
          {reviewOptions.map((option) => (
            <ReviewOption
              key={option.key}
              label={option.label}
              optionValue={option.value}
              context={option.context}
              stepStore={stepStore}
            />
          ))}
        </Box>
        <Divider />
        <ReviewActions stepStore={stepStore} />
      </Box>
    );
  }
);

export default ReviewStep;
