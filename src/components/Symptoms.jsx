import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

export default function Symptoms({
  context: { handleSymptomChange, bodyPart, symptomsList },
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
          Symptom / Frequency for <strong>{bodyPart}</strong>
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          maxWidth="100%"
          gap=" 10px"
          ml={4}
        >
          {symptomsList.map((symptom) => (
            <Box
              key={symptom.name}
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 calc(50% - 10px)" }, // Responsive: full width on xs, 50% on md and up
              }}
            >
              <FormControlLabel
                control={<Checkbox />}
                value={symptom.name}
                checked={symptom.checked}
                onChange={handleSymptomChange}
                label={symptom.name
                  .split("_")
                  .map((word, index) =>
                    index === 0 ? word[0].toUpperCase() + word.slice(1) : word
                  )
                  .join(" ")}
              />
            </Box>
          ))}
        </Box>
      </FormGroup>
    </Box>
  );
}
