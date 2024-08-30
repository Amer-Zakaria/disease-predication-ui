import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

export default function Symptoms({
  context: { pickedSymptoms, handleSymptomChange, bodyParts, symptomsList },
}) {
  return (
    <Box maxWidth="600px" mt={2} width="100%">
      <FormGroup
        style={{
          width: "100%",
          rowGap: 5,
        }}
      >
        <Typography
          alignSelf="flex-start"
          variant="h6"
          fontWeight="400"
          gutterBottom
          mb={1.5}
        >
          Symptoms for <strong>{bodyParts.join(", ")}</strong>.
        </Typography>

        <Box>
          {bodyParts
            .map((bp) => ({
              bodyPart: bp,
              symptoms: symptomsList.filter((s) => s.bodyPart === bp),
            }))
            .map((bodypartSymptomMap) => (
              <Box mb={2} key={bodypartSymptomMap.bodyPart}>
                <Typography
                  variant="overline"
                  sx={{
                    width: "100%",
                    alignItems: "center",
                    color: "#4d6182",
                    margin: "1px auto",
                    // textAlign: "center",
                    display: "block",

                    /*                 "&::after": {
                      content: '""',
                      width: "25%",
                      verticalAlign: "middle",
                      display: "inline-block",
                      ml: 1,
                      bgcolor: "#4d6182",
                      height: ".5px",
                      flex: "1 1",
                    }, */
                    "&::before": {
                      content: '""',
                      width: "20%",
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
                <Box
                  display="flex"
                  justifyContent="center"
                  flexWrap="wrap"
                  maxWidth="100%"
                  gap=" 10px"
                  ml={4}
                >
                  {bodypartSymptomMap.symptoms.map((symptom) => (
                    <Box
                      key={symptom.name}
                      sx={{
                        flex: { xs: "1 1 100%", md: "1 1 calc(50% - 10px)" }, // Responsive: full width on xs, 50% on md and up
                      }}
                    >
                      <FormControlLabel
                        control={<Checkbox />}
                        value={symptom.name}
                        checked={pickedSymptoms[symptom.placeIndex] === 1}
                        onChange={handleSymptomChange}
                        label={symptom.name
                          .split("_")
                          .map((word, index) =>
                            index === 0
                              ? word[0].toUpperCase() + word.slice(1)
                              : word
                          )
                          .join(" ")}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
        </Box>
      </FormGroup>
    </Box>
  );
}
