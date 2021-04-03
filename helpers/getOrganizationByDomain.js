import { q, client } from "helpers/fauna";

const getOrganizationByDomain = async (domain) => {
  const { data: organization } = await client.query(
    q.Get(q.Match(q.Index("organization_by_domain"), domain))
  );

  return organization;
};

export default getOrganizationByDomain;
