import { STATUS } from "../App";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GetReportButton from "./GetReportButton";
import CircularProgress from "@mui/material/CircularProgress";

export default function Report({ context }) {
  const { report, symptomsList, bodyParts, requestStatus, pickedSymptoms } =
    context;

  return (
    <Box maxWidth="600px" mt={2} minHeight={10} width="100%" mx={1}>
      <Box>
        <Typography marginBottom={2} variant="h4">
          Review
        </Typography>

        {bodyParts
          .map((bp) => ({
            bodyPart: bp,
            symptoms: symptomsList
              .filter((s) => s.bodyPart === bp)
              .filter((s) => pickedSymptoms[s.placeIndex]),
          }))
          .filter(
            (bodypartSymptomMap) => bodypartSymptomMap.symptoms.length >= 1
          )
          .map((bodypartSymptomMap) => (
            <Box ml={1} key={bodypartSymptomMap.bodyPart}>
              <Typography
                variant="overline"
                sx={{
                  width: "100%",
                  alignItems: "center",
                  color: "#4d6182",
                  margin: "1px auto",

                  "&::before": {
                    content: '""',
                    width: "3%",
                    verticalAlign: "middle",
                    display: "inline-block",
                    mr: 1,
                    bgcolor: "#4d6182",
                    height: ".5px",
                    flex: "1 1",
                  },
                }}
              >
                {bodypartSymptomMap.bodyPart}
              </Typography>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  margin: "5px 15px 20px 0",
                }}
              >
                {bodypartSymptomMap.symptoms
                  // .filter((symptom) => pickedSymptoms[symptom.checked])
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
            </Box>
          ))}
        <Box mt={2.5}>
          <GetReportButton context={context} />
        </Box>
      </Box>

      <Box my={5}>
        <Typography
          marginBottom={2}
          variant="h4"
          sx={{
            "&::after": {
              content:
                requestStatus !== STATUS.success
                  ? "'(It may take time ~ 1min+ )'"
                  : "''",
              fontSize: ".9rem",
              verticalAlign: "middle",
              ml: 1,
            },
          }}
        >
          Report
        </Typography>

        <Box>
          {requestStatus === STATUS.success && (
            <Box maxWidth="400px">
              <Typography ml={2}>
                Predicated Disease: <strong>{report[0]}</strong>
              </Typography>
              <Typography ml={2} mt={0.5}>
                confidence: <strong>{report[1] * 100}%</strong>
              </Typography>
            </Box>
          )}
          {requestStatus !== STATUS.success && (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
              }}
            >
              {requestStatus === STATUS.pending && (
                <Typography variant="caption">
                  Report will appear here
                </Typography>
              )}
              {requestStatus === STATUS.error && (
                <Typography variant="caption" color="error">
                  An error occurred, please try again.
                </Typography>
              )}
              {requestStatus === STATUS.loading && (
                <CircularProgress
                  sx={{
                    color: "gray",
                  }}
                  size={20}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
