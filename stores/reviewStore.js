import { createContext, useContext } from "react";
import get from "lodash.get";
import { getPrimaryActionForValue } from "helpers/review";

const storeContext = createContext(null);

export const setupReviewStore = ({
  storedData = {},
  extractedData = {},
  reviewedData = {},
}) => {
  return () => ({
    currentStep: null,
    steps: [],
    skippedFields: [],
    newData: {},
    storedData,
    extractedData,
    reviewedData,
    getDataForField(field) {
      return {
        storedValue: get(this.storedData, field, null),
        extractedValue: get(this.extractedData, field, null),
        reviewedValue: get(this.reviewedData, field, null),
      };
    },
    // Return the current committed action for a given field (ACCEPT, PENDING,
    // etc...)
    getCommittedActionForField(field) {
      if (this.skippedFields.includes(field)) return "SKIP";
      if (!this.newData.hasOwnProperty(field)) return "PENDING";

      return getPrimaryActionForValue(
        this.newData[field],
        this.getDataForField(field)
      );
    },
    // Get the new value for the given field (yet to be saved). If none, return
    // the stored value for the field
    getFutureValueForField(field) {
      return get(this.newData, field, this.storedData[field]);
    },
    addStep(newStep) {
      this.removeStep(newStep);
      this.steps = [...this.steps, newStep];

      if (this.currentStep == null) this.currentStep = newStep;
    },
    removeStep({ field }) {
      this.steps = this.steps.filter((step) => step.field != field);
    },
    getSuggestedValueForField(field) {
      if (storedValue === lastReviewedValue) return extractedValue;

      return dataValue;
    },
    get currentField() {
      return this.currentStep?.field;
    },
    setCurrentField(field) {
      this.currentStep = this.steps.find((step) => step.field === field);
    },
    skipField(field) {
      delete this.newData[field];
      this.unskipField(field);
      this.skippedFields = [...this.skippedFields, field];
    },
    unskipField(field) {
      this.skippedFields = this.skippedFields.filter(
        (skippedField) => skippedField != field
      );
    },
    setNewValueForField({ field, newValue }) {
      this.unskipField(field);
      this.newData[field] = newValue;
    },
    nextStep() {
      const stepIndex = this.steps.findIndex(
        (step) => step.field === this.currentField
      );
      this.currentStep = this.steps[stepIndex + 1];
    },
  });
};

export const ReviewStoreProvider = ({ children, store }) => (
  <storeContext.Provider value={store}>{children}</storeContext.Provider>
);

export const useReviewStore = () => {
  const store = useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error(
      "useReviewStore must be used within a ReviewStoreProvider."
    );
  }
  return store;
};
