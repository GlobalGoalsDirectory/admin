import { Box, Button, Paper, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AppLayout from "layouts/AppLayout";

const COLUMNS = [
  { field: "id", headerName: "Domain", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "View",
    headerName: "",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: ({ row }) => (
      <Button variant="contained" color="primary" size="small">
        View
      </Button>
    ),
  },
];

const HomePage = ({ organizations }) => (
  <AppLayout isAuthenticated={true}>
    <Typography variant="h1" gutterBottom>
      Organizations
    </Typography>
    <Box display="flex" flexGrow={1} clone>
      <Paper>
        <DataGrid
          rows={organizations.map((org) => ({ id: org.domain, ...org }))}
          columns={COLUMNS}
          disableSelectionOnClick
          disableColumnSelector={true}
        />
      </Paper>
    </Box>
  </AppLayout>
);

import authenticate from "helpers/authenticate";
import redirectToLoginPage from "helpers/redirectToLoginPage";
import getAllOrganizations from "helpers/getAllOrganizations";

export async function getServerSideProps({ req, res }) {
  const user = await authenticate({ req, res });
  if (!user) return redirectToLoginPage();

  const organizations = await getAllOrganizations({ req });

  return {
    props: {
      organizations,
    },
  };
}

export default HomePage;
