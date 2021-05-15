import { q, client } from "helpers/fauna";

const getPublishedOrganizations = async () => {
  const { data } = await client.query(
    q.Paginate(q.Match(q.Index("published_organizations"), true), {
      size: 5000,
    })
  );

  const organizations = data.map((values) => ({
    domain: values[0],
    name: values[1],
    faunaId: values[2].id,
  }));

  return organizations;
};

export default getPublishedOrganizations;
