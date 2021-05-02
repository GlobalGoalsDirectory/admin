import cloudinary from "cloudinary";
import authenticate from "helpers/authenticate";

export default async function handler(req, res) {
  const user = await authenticate({ req, res });

  if (!user) {
    res.status(403).json({
      error: { type: "unauthorized", message: "You are not signed in." },
    });
    return;
  }

  const error = (type, message) =>
    res.status(422).json({
      error: { type, message },
    });

  if (req.method !== "POST") {
    return error("invalid-request", "Request must use POST method.");
  }

  const { paramsToSign } = req.body;

  // Check that all keys are permitted
  const ALLOWED_KEYS = [
    "timestamp",
    "upload_preset",
    "source",
    "custom_coordinates",
  ];
  const forbiddenFields = Object.keys(paramsToSign).filter(
    (key) => !ALLOWED_KEYS.includes(key)
  );
  if (forbiddenFields.length) {
    return error(
      "invalid-request",
      `Fields ${forbiddenFields.join(", ")} are not permitted.`
    );
  }

  // Verify that upload preset equals ggd-logo
  if (paramsToSign.upload_preset != "ggd-logo") {
    return error("invalid-request", "upload_preset must be 'ggd-logo'");
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.status(200).json({ data: { signature } });
}
