import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { observer } from "mobx-react-lite";
import { Box, Button, Typography } from "@material-ui/core";
import ReviewTextField from "components/ReviewTextField";
import ReviewImage from "components/ReviewImage";
import LoadingButton from "components/LoadingButton";
import { getReviewColorForAction } from "helpers/review";

function loadScript(scriptUrl) {
  const script = document.createElement("script");
  script.src = scriptUrl;
  document.body.appendChild(script);

  return new Promise((res, rej) => {
    script.onload = function () {
      res();
    };
    script.onerror = function () {
      rej();
    };
  });
}

const ReviewInputText = observer(({ field, label, stepStore }) => (
  <ReviewTextField
    id={field}
    label={label}
    value={stepStore.newValue}
    onChange={(event) => stepStore.setNewValue(event.target.value)}
    color={getReviewColorForAction(stepStore.primaryAction)}
    multiline={stepStore.fieldType === "text"}
    rows={stepStore.fieldType === "text" ? 5 : 1}
  />
));

const ReviewInputImage = observer(({ stepStore }) => {
  const uploadWidget = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadScript("https://upload-widget.cloudinary.com/global/all.js").then(
      () => {
        uploadWidget.current = window.cloudinary.createUploadWidget(
          {
            api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
            cloudName: "df5iks2fh",
            uploadPreset: "ggd-logo",
            sources: ["local", "url"],
            multiple: false,
            cropping: true,
            croppingCoordinatesMode: "custom",
            croppingAspectRatio: 1,
            croppingShowDimensions: true,
            croppingValidateDimensions: true,
            croppingShowBackButton: true,
            showSkipCropButton: false,
            upload_signature: (callback, paramsToSign) =>
              fetch("/api/sign-cloudinary-upload", {
                body: JSON.stringify({ paramsToSign }),
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "POST",
              })
                .then((res) => res.json())
                .then(({ error, data }) => {
                  if (error) alert(error.message);
                  callback(data?.signature);
                }),
          },
          (error, result) => {
            if (error) console.error(error);

            // Successful upload, display image
            if (result?.event === "success") {
              const imageUrl = result.info.secure_url;
              stepStore.setNewValue(imageUrl);
            }
          }
        );
        setIsLoaded(true);
      }
    );
  }, []);

  return (
    <>
      <Box marginBottom={1}>
        <ReviewImage value={stepStore.newValue} width={150} height={150} />
      </Box>
      <Box display="flex">
        <Box marginRight={1}>
          <LoadingButton
            onClick={() => uploadWidget.current?.open()}
            variant="outlined"
            loading={!isLoaded}
          >
            Change
          </LoadingButton>
        </Box>
        <Button
          disabled={stepStore.newValue === null}
          onClick={() => stepStore.setNewValue(null)}
          variant="outlined"
        >
          Clear
        </Button>
      </Box>
    </>
  );
});

const ReviewInput = observer(({ field, label, stepStore }) => (
  <Box marginX={4} marginY={3}>
    {["string", "text"].includes(stepStore.fieldType) && (
      <ReviewInputText field={field} label={label} stepStore={stepStore} />
    )}
    {stepStore.fieldType === "image" && (
      <ReviewInputImage stepStore={stepStore} />
    )}
  </Box>
));

export default ReviewInput;
