import { q, client } from "helpers/fauna";

const getRejectedOrganizations = async () => {
  const { data } = await client.query(
    q.Paginate(q.Match(q.Index("rejected_organizations"), true), {
      size: 5000,
    })
  );

  const organizations = data.map((values) => ({
    updatedAt: values[0],
    domain: values[1],
    faunaId: values[2].id,
  }));

  return organizations;
};

export default getRejectedOrganizations;
