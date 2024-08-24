import { STATUS } from "../App";

import Button from "@mui/material/Button";

export default function GetReportButton({
  context: { pickedSymptoms, hanbdleSubmit, requestStatus },
}) {
  const oneCheckedList = pickedSymptoms.find((s) => s);
  const isLoading = requestStatus === STATUS.loading;

  return (
    <Button
      /* If there's no at least one checked symptom or report is being fetched disable the button  */
      disabled={!oneCheckedList || isLoading}
      onClick={hanbdleSubmit}
      variant="contained"
      style={{ width: "fit-content" }}
    >
      Get Report
    </Button>
  );
}
