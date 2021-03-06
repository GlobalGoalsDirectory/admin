import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Box, Divider, TextField, Typography } from "@material-ui/core";
import { useReviewStore } from "stores/reviewStore";
import ReviewTextField from "components/ReviewTextField";
import ReviewImage from "components/ReviewImage";
import toTitleCase from "helpers/toTitleCase";
import { getReviewColorForAction } from "helpers/review";
import LoadingButton from "components/LoadingButton";

const ReviewField = observer(({ field, label, type = "string", ...props }) => {
  const reviewStore = useReviewStore();
  if (label == null)
    label = field.replace("_", " ").split(" ").map(toTitleCase).join(" ");

  return (
    <Box marginY={1}>
      {["string", "text"].includes(type) && (
        <ReviewTextField
          value={reviewStore.getFutureValueForField(field)}
          color={getReviewColorForAction(
            reviewStore.getCommittedActionForField(field)
          )}
          label={label}
          multiline={type === "text"}
          rows={type === "text" ? 5 : 1}
          disabled
          {...props}
        />
      )}
      {type === "image" && (
        <ReviewImage
          value={reviewStore.getFutureValueForField(field)}
          width={100}
          height={100}
        />
      )}
    </Box>
  );
});

const ReviewConfirmation = observer(
  ({ submitReview, comment: initialComment }) => {
    const reviewStore = useReviewStore();
    const field = "confirmation";
    const label = "Review";
    const handleError = (message) => {
      alert(message);
      setLoading(false);
    };

    const [comment, setComment] = useState(initialComment);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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
            <Box marginTop={3} marginBottom={1}>
              <Typography variant="h6">Metadata</Typography>
            </Box>
            <ReviewField field="logo" type="image" />
            <ReviewField field="name" />
            <ReviewField field="homepage" />
            <ReviewField field="about" type="text" />
            <ReviewField label="Commitment" field="commitment_url" />

            <Box marginTop={3} marginBottom={1}>
              <Typography variant="h6">Location</Typography>
            </Box>
            <ReviewField field="address" />
            <ReviewField field="state" />
            <ReviewField field="country" />
            <ReviewField field="latitude" />
            <ReviewField field="longitude" />

            <Box marginTop={3} marginBottom={1}>
              <Typography variant="h6">Social Accounts</Typography>
            </Box>
            <ReviewField field="facebook_handle" />
            <ReviewField field="twitter_handle" />
            <ReviewField field="linkedin_handle" />

            <Box marginTop={3} marginBottom={1}>
              <Typography variant="h6">Internal</Typography>
            </Box>
            <TextField
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              multiline
              rows={5}
              fullWidth
              placeholder="Anything to note about this review? How can we improve our AI?"
              variant="filled"
              label="Comments and Notes"
              id="comments"
            />
          </Box>
        </Box>
        <Divider />
        <Box paddingX={4} paddingY={2} display="flex" justifyContent="flex-end">
          <Box marginLeft={1} clone>
            <LoadingButton
              color="primary"
              variant="contained"
              loading={loading}
              onClick={async () => {
                setLoading(true);
                submitReview({ comment }).catch(handleError);
              }}
            >
              Confirm
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default ReviewConfirmation;
