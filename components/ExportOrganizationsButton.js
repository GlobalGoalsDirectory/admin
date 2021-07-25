import { useState } from "react";
import { Download } from "mdi-material-ui";
import { saveAs } from "file-saver";
import jsonexport from "jsonexport";
import { q, client } from "faunadb";
import LoadingButton from "components/LoadingButton";

const ExportOrganizationsButton = ({ organizationIds }) => {
  const [isPreparing, setIsPreparing] = useState(false);
  const [blob, setBlob] = useState(null);

  const downloadBlob = () => {
    saveAs(blob, "Global Goals Directory - Organizations.csv");
  };

  const prepareBlob = async () => {
    setIsPreparing(true);

    // Fetch organizations
    const res = await fetch("/api/organizations/export", {
      body: JSON.stringify({
        ids: organizationIds,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      const { error } = await res.json();
      console.error(error);
      alert(error);
      return;
    }

    const { organizations } = await res.json();

    // Prepare blob
    jsonexport(organizations, (_error, csv) => {
      setBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      setIsPreparing(false);
    });
  };

  return (
    <LoadingButton
      loading={isPreparing}
      startIcon={<Download />}
      variant="outlined"
      onClick={blob ? downloadBlob : prepareBlob}
    >
      {!blob && !isPreparing && "Export to CSV"}
      {isPreparing && "Preparing CSV..."}
      {blob && "Download CSV"}
    </LoadingButton>
  );
};

export default ExportOrganizationsButton;
