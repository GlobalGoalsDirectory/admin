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
            <Typography component="span" display="block" variant="body1">
              <Diff before={stepStore.newValue} after={optionValue} />
            </Typography>
          </>
        }
        style={{ display: "flex", alignItems: "flex-start" }}
      />
    </Box>
    <Divider light />
  </>
));

export default ReviewOption;
