import { q, client } from "helpers/fauna";
import get from "lodash.get";

// Fetch all organizations for the given IDs
const fetchOrganizations = async ({ ids }) => {
  const results = await client.query(
    ids.map((id) => q.Get(q.Ref(q.Collection("organizations"), id)))
  );

  const organizations = results.map((result) => {
    const { domain, data } = result.data;

    // Extract metadata
    const metadata = {};
    ["name", "homepage", "commitment_url"].map((key) => {
      metadata[key] = get(data, key, null);
      delete data[key];
    });

    // Extract location data
    const location = {};
    ["address", "state", "country", "latitude", "longitude"].map((key) => {
      location[key] = get(data, key, null);
      delete data[key];
    });

    // Extract scores
    const scores = {};
    const sdgKeys = Array.from({ length: 17 }).map(
      (_, i) => `sdg${i + 1}_score`
    );
    ["total_score", "sdgs_score", ...sdgKeys].map((key) => {
      scores[key] = get(data, key, null);
      delete data[key];
    });

    // Extract details
    const details = {};
    [
      "about",
      "logo",
      "facebook_handle",
      "linkedin_handle",
      "twitter_handle",
    ].map((key) => {
      details[key] = get(data, key, null);
      delete data[key];
    });

    return {
      domain,
      ...metadata,
      ...location,
      ...scores,
      ...details,
      ...data,
    };
  });

  return organizations;
};

export default fetchOrganizations;
