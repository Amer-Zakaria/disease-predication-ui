import { STATUS } from "../App";

import Button from "@mui/material/Button";

export default function GetReportButton({
  context: { symptomsList, hanbdleSubmit, requestStatus },
}) {
  const oneCheckedList = symptomsList.find((symptom) => symptom.checked);
  const isLoading = requestStatus === STATUS.loading;

  return (
    <Button
      /* If there's no at least one checked symptom or report is being fetched disable the button  */
      disabled={!oneCheckedList || isLoading}
      onClick={hanbdleSubmit}
      variant="outlined"
      style={{ width: "fit-content" }}
    >
      Get Report
    </Button>
  );
}
