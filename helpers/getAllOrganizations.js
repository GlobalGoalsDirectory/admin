import { q, client } from "helpers/fauna";

const getAllOrganizations = async () => {
  const { data } = await client.query(
    q.Paginate(q.Match(q.Ref("indexes/all_organizations")), { size: 5000 })
  );

  const organizations = data.map((values) => ({
    ref: values[0].id,
    domain: values[1],
    name: values[2],
  }));

  return organizations;
};

export default getAllOrganizations;
