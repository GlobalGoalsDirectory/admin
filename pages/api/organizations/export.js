import authenticate from "helpers/authenticate";
import doNotWaitForEmptyEventLoop from "helpers/doNotWaitForEmptyEventLoop";
import fetchOrganizations from "helpers/fetchOrganizations";

export default async function handler(req, res) {
  doNotWaitForEmptyEventLoop({ req, res });

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

  const { ids } = req.body;

  let organizations;

  try {
    organizations = await fetchOrganizations({ ids });
  } catch (error) {
    res.status(422).json({
      error: { type: "invalid-request", message: error.message },
    });
    return;
  }

  res.status(200).json({ organizations });
}
