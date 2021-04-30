import { q, client } from "helpers/fauna";

const getOrganizationsToReview = async () => {
  const { data } = await client.query(
    q.Paginate(q.Match(q.Index("organizations_to_review"), true), {
      size: 5000,
    })
  );

  const organizations = data.map((values) => ({
    reviewedOrCreatedAt: values[0],
    domain: values[1],
    faunaId: values[2].id,
    name: values[3],
    needsReview: values[4],
  }));

  return organizations;
};

export default getOrganizationsToReview;
