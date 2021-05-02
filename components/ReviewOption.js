import { observer } from "mobx-react-lite";
import {
  Box,
  Divider,
  FormControlLabel,
  Radio,
  Typography,
} from "@material-ui/core";
import { CheckboxMarkedCircle } from "mdi-material-ui";
import Diff from "components/Diff";

const ReviewOptionString = ({ optionValue, currentValue }) => (
  <Typography component="span" display="block" variant="body1">
    <Diff before={currentValue} after={optionValue} />
  </Typography>
);

const ReviewOptionImage = ({ optionValue }) => {
  if (optionValue != null) return <img src={optionValue} height={100} />;

  return (
    <Typography
      component="span"
      display="block"
      variant="body1"
      style={{ fontStyle: "italic" }}
    >
      No image
    </Typography>
  );
};

const ReviewOption = observer(({ label, optionValue, testId, stepStore }) => (
  <>
    <Box paddingX={4} paddingY={2} clone>
      <FormControlLabel
        onChange={({ target }) =>
          target.checked && stepStore.setNewValue(optionValue)
        }
        control={
          <Radio
            inputProps={{ "data-testid": testId }}
            checkedIcon={<CheckboxMarkedCircle />}
            checked={stepStore.newValue === optionValue}
            style={{ color: stepStore.getReviewColorForValue(optionValue) }}
          />
        }
        label={
          <>
            <Typography component="span" display="block" variant="h6">
              {label}
            </Typography>
            {["string", "text"].includes(stepStore.fieldType) && (
              <ReviewOptionString
                optionValue={optionValue}
                currentValue={stepStore.newValue}
              />
            )}
            {stepStore.fieldType === "image" && (
              <ReviewOptionImage optionValue={optionValue} />
            )}
          </>
        }
        style={{ display: "flex", alignItems: "flex-start" }}
      />
    </Box>
    <Divider light />
  </>
));

export default ReviewOption;
