import { q, client } from "helpers/fauna";
import { remapKeysFromDatabase } from "helpers/organization";

const getOrganizationByDomain = async (domain) => {
  const { ref, data } = await client.query(
    q.Get(q.Match(q.Index("organization_by_domain"), domain))
  );

  const organization = {
    faunaId: ref.id,
    ...remapKeysFromDatabase(data),
  };

  return organization;
};

export default getOrganizationByDomain;
