import { Box, Typography } from "@material-ui/core";

const ReviewImage = ({ value, width, height }) => (
  <>
    {value ? (
      <img
        src={value}
        width={width}
        height={height}
        style={{ display: "block" }}
      />
    ) : (
      <Box
        width={width}
        height={height}
        border="3px dashed #c4c4c4"
        borderRadius={8}
        color="#c4c4c4"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1">
          <Box component="span" fontWeight={500}>
            NO IMAGE
          </Box>
        </Typography>
      </Box>
    )}
  </>
);

export default ReviewImage;
