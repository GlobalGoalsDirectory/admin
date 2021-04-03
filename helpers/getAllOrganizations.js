import faunadb from "faunadb";
import doNotWaitForEmptyEventLoop from "helpers/doNotWaitForEmptyEventLoop";

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_KEY,
});

const getAllOrganizations = async (context) => {
  doNotWaitForEmptyEventLoop(context);

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
