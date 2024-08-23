import { STATUS } from "../App";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GetReportButton from "./GetReportButton";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

export default function Report({ context }) {
  const { report, symptomsList, bodyPart, requestStatus } = context;

  return (
    <Box maxWidth="700px" mt={2} minHeight={10} width="100%" mx={5}>
      <Box
        sx={{
          px: "1.6rem",
        }}
      >
        <Typography variant="h6" fontWeight="400">
          Symptoms for <strong>{bodyPart}</strong>
        </Typography>
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            margin: "20px 10px",
          }}
        >
          {symptomsList
            .filter((symptom) => symptom.checked)
            .map((symptom) => (
              <Box
                key={symptom.name}
                sx={{
                  flex: { xs: "1 1 100%", md: "1 1 calc(50% - 10px)" }, // Responsive: full width on xs, 50% on md and up
                }}
              >
                <li>
                  <Typography variant="body1">
                    {symptom.name
                      .split("_")
                      .map((word, index) =>
                        index === 0
                          ? word[0].toUpperCase() + word.slice(1)
                          : word
                      )
                      .join(" ")}
                  </Typography>
                </li>
              </Box>
            ))}
        </ul>
        <GetReportButton context={context} />
      </Box>

      <Box
        sx={{
          mt: 2,
          padding: "1.6rem",
        }}
      >
        <Typography marginBottom={2} variant="h4">
          Report
        </Typography>

        {requestStatus === STATUS.success && (
          <Typography ml={2}>{report}</Typography>
        )}
        {requestStatus !== STATUS.success && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100px",
              flexDirection: "column",
            }}
          >
            {requestStatus === STATUS.pending && (
              <Typography variant="caption">Report will appear here</Typography>
            )}
            {requestStatus === STATUS.error && (
              <Typography variant="caption" color="error">
                An error occurred, please try again.
              </Typography>
            )}
            {requestStatus === STATUS.loading && (
              <CircularProgress
                sx={{ display: "block", marginTop: "1rem", color: "gray" }}
                size={20}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
