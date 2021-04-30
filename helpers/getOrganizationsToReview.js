import { q, client } from "helpers/fauna";

const getOrganizationsToReview = async () => {
  const { data } = await client.query(
    q.Paginate(q.Match(q.Index("organizations_to_review"), true), {
      size: 5000,
    })
  );

  const organizations = data.map((values) => ({
    faunaId: values[0].id,
    domain: values[1],
    name: values[2],
    needs_review: values[3],
  }));

  return organizations;
};

export default getOrganizationsToReview;
