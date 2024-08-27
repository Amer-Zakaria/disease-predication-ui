import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import data from "./data.json";
import axios from "axios";

import Container from "@mui/material/Container";

import Symptoms from "./components/Symptoms";
import Report from "./components/Report";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import BodyPart from "./components/BodyPart";

export const STATUS = {
  pending: "PENDING",
  error: "ERROR",
  loading: "LOADING",
  success: "SUCCESS",
};

function App() {
  const zeros = useMemo(
    () =>
      new Array(133)
        .join(0)
        .split("")
        .map((z) => +z),
    []
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production")
      axios.get("https://disease-predication-server.onrender.com/health");
  }, []);

  const [bodyParts, setBodyParts] = useState([]);
  const [symptomsList, setSymptomsList] = useState([]);
  const [report, setReport] = useState([]);
  const [requestStatus, setRequestStatus] = useState(STATUS.pending);
  const [activeStep, setActiveStep] = useState(0);
  const [pickedSymptoms, setPickedSymptoms] = useState(zeros); // [0] * 132
  console.log(pickedSymptoms);
  const steps = [
    { nextCond: bodyParts.length >= 1, title: "Select body parts" },
    {
      nextCond: pickedSymptoms.find((s) => s === 1),
      title: "Select symptoms",
    },
    { nextCond: true, title: "Review & Get report" },
  ];

  function handleBodyPartSelectorChange(event, bodyPart) {
    const pickedBodyPart =
      bodyPart || event.target.querySelector("title").textContent;

    // change the body part & symptom accordingly
    if (bodyParts.find((bp) => bp === pickedBodyPart)) {
      /* deselect a body part */
      setPickedSymptoms((old) => {
        const sIndexes = symptomsList
          .filter((s) => s.bodyPart === pickedBodyPart)
          .map((s) => s.placeIndex);
        const newList = [...old].map((oldBinary, i) =>
          sIndexes.find((sIndex) => sIndex === i) ? 0 : oldBinary
        );
        return newList;
      });
      setBodyParts((oldBodyParts) =>
        oldBodyParts.filter((bp) => bp !== pickedBodyPart)
      );
      setSymptomsList((oldSymptomsList) =>
        oldSymptomsList.filter((s) => s.bodyPart !== pickedBodyPart)
      );
    } else {
      /* select new body part */
      setBodyParts((oldBodyParts) => oldBodyParts.concat([pickedBodyPart]));
      setSymptomsList((oldSymptomsList) =>
        oldSymptomsList.concat(
          data
            .find(
              (bodyPartSymptomsMap) =>
                bodyPartSymptomsMap.bodyPart === pickedBodyPart
            )
            .symptoms.map(({ name, placeIndex }) => ({
              name: name,
              placeIndex: placeIndex,
              bodyPart: pickedBodyPart,
            }))
        )
      );
    }
  }

  function handleSymptomChange(event) {
    const checkedSymptomName = event.target.value;

    const checkedSymptomPlace = symptomsList.find(
      (s) => s.name === checkedSymptomName
    ).placeIndex;

    setPickedSymptoms((oldPickedSymptoms) =>
      oldPickedSymptoms.map((s, i) =>
        i === checkedSymptomPlace ? (s === 1 ? 0 : 1) : s
      )
    );
  }

  async function hanbdleSubmit() {
    try {
      setRequestStatus(STATUS.loading);

      const requestData = pickedSymptoms;

      const response = await axios.post(
        process.env.NODE_ENV === "production"
          ? "https://disease-predication-server.onrender.com"
          : "http://localhost:8080",
        requestData
      );
      setRequestStatus(STATUS.success);
      setReport(response.data);
    } catch (err) {
      setRequestStatus(STATUS.error);
    }
  }

  const handleNext = () => {
    if (activeStep + 1 === steps.length) {
      // if Last step (RESET)
      setBodyParts([]);
      setReport([]);
      setSymptomsList([]);
      setPickedSymptoms(zeros);
      setActiveStep(0);
      setRequestStatus(STATUS.pending);
    } else setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const context = {
    data,
    bodyParts,
    symptomsList,
    pickedSymptoms,
    report,
    requestStatus,
    handleBodyPartSelectorChange,
    handleSymptomChange,
    hanbdleSubmit,
  };

  return (
    <Container
      maxWidth="md"
      sx={{ width: "100%", mt: 4, position: "relative" }}
    >
      {/* Steps header */}
      <Stepper activeStep={activeStep}>
        {steps
          .map((step) => step.title)
          .map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
      </Stepper>

      {/* Steps content */}
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        mt={5}
        mb={12}
        minHeight="350px"
      >
        {activeStep === 0 && <BodyPart context={context} />}

        {activeStep === 1 && <Symptoms context={context} />}

        {activeStep === 2 && <Report context={context} />}
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          position: "fixed",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          pt: 2,
          pb: 5,
          px: 3,
          mt: 3,
          bottom: "-70px",
          borderRadius: "14px 14px 0 0",
          background: "#E5F0FF",
          opacity: 1,
          maxWidth: "700px",
          width: "100%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        bgcolor="red"
      >
        <Button
          color="inherit"
          disabled={activeStep === 0 || requestStatus === STATUS.loading}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={handleNext}
          variant={activeStep === steps.length - 1 ? "outlined" : "contained"}
          disabled={
            !steps[activeStep].nextCond || requestStatus === STATUS.loading
          }
        >
          {activeStep === steps.length - 1 ? "Rest" : "Next"}
        </Button>
      </Box>
    </Container>
  );
}

export default App;
