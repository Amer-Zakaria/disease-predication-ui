import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Body from "./Body";
import { Typography } from "@mui/material";
import data from "../data.json";

export default function BodyPart({
  context: {
    bodyParts,
    handleBodyPartSelectorChange,
  } /* extract necessary variable and functions from the context */,
}) {
  return (
    <>
      <Box
        minWidth="100%"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-evenly"
        rowGap={3}
        mb={2}
      >
        <Typography
          alignSelf="flex-start"
          variant="h6"
          fontWeight="400"
          gutterBottom
          textAlign="center"
          mb={1.5}
        >
          Select the body parts where your symptoms are occurring
        </Typography>
        <Box
          textAlign="center"
          display="flex"
          rowGap={4}
          flexWrap="wrap"
          justifyContent="space-evenly"
        >
          <Body
            handleBodyPartSelectorChange={handleBodyPartSelectorChange}
            bodyParts={bodyParts}
          />
        </Box>
        <Box width="100%">
          <div className="or">and / or</div>
        </Box>
        <Typography
          variant="h6"
          fontWeight="400"
          gutterBottom
          textAlign="center"
          mb={0.5}
        >
          Body Layers
        </Typography>
        <Box textAlign="center" width="100%">
          <ToggleButtonGroup
            color="error"
            value={bodyParts}
            onChange={(e) => handleBodyPartSelectorChange(e, e.target.value)}
          >
            {data
              .filter((bodyPartSymptomMap) => bodyPartSymptomMap.isNew)
              .map(({ bodyPart }) => (
                <ToggleButton value={bodyPart}>{bodyPart}</ToggleButton>
              ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
    </>
  );
}
