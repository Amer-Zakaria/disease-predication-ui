import React from "react";
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

// Fetshing report state possibilties
export const STATUS = {
  pending: "PENDING",
  error: "ERROR",
  loading: "LOADING",
  success: "SUCCESS",
};

function App() {
  // the needed variables and their corresponding functions that's responsble to change them
  const [bodyPart, setBodyPart] = useState("");
  const [symptomsList, setSymptomsList] = useState([]);
  const [report, setReport] = useState("");
  const [requestStatus, setRequestStatus] = useState(STATUS.pending);
  const [activeStep, setActiveStep] = useState(0);
  const [pickedSymptoms, setPickedSymptoms] = useState(
    new Array(133)
      .join(0)
      .split("")
      .map((z) => +z)
  );

  const steps = [
    { nextCond: bodyPart, title: "Select body parts" },
    {
      nextCond: symptomsList.find((symptom) => symptom.checked),
      title: "Select symptoms",
    },
    { nextCond: true, title: "Review & Get report" },
  ];

  /* whenever a body part selected this function gets triggered  */
  function handleBodyPartSelectorChange(event, bodyPart) {
    // store the picked body part, ex: "Skin"
    const pickedBodyPart =
      bodyPart || event.target.querySelector("title").textContent;
    // change the body part accordingly
    setBodyPart(pickedBodyPart);

    // find the symptoms for the selected body part
    const symptoms = data.find(
      (disease) => disease.bodyPart === pickedBodyPart
    ).symptoms;

    // change symptoms variable to an array of objects
    setSymptomsList(
      //ex: if symptoms is ["Skin", ...] => [{name: "Skin", checked: false, count: 0}, ...]
      symptoms.map((s) => ({
        name: s.name,
        checked: false,
        placeIndex: s.placeIndex,
      }))
    );
  }

  /* whenever an individual symptom gets checked this function gets triggered  */
  function handleSymptomChange(event) {
    // store the selected symptom, ex: "Rash"
    const checkedSymptomName = event.target.value;

    // chnage the slected symptom in the sysmptoms array variable
    setSymptomsList((oldSymptomsList) => {
      const newSymptomsList = oldSymptomsList.map((symptom) =>
        symptom.name === checkedSymptomName
          ? {
              ...symptom,
              checked: !symptom.checked /* the opposite of what it was */,
            }
          : symptom
      );

      return newSymptomsList;
    });
    /* ex:
        checkedSymptomName: "Skin"
        oldSymptomsList: [..., {name: "Skin", checked: true, count: 0}, ...]
        new symptoms list: -> [..., {name: "Skin", checked: false, count: 0}, ...]
    */
  }

  /* whenever the get report button gets clicked this function gets triggered  */
  async function hanbdleSubmit() {
    const numberOfSymptoms = 132;
    const constructSypmtomsBinaryList = new Array(numberOfSymptoms + 1)
      .join(0)
      .split("")
      .map((z) => +z);

    // handle submit
    try {
      setRequestStatus(STATUS.loading);

      const selectedSymptoms = symptomsList.filter(
        (symptom) => symptom.checked
      );

      selectedSymptoms.forEach(
        (s) => (constructSypmtomsBinaryList[s.placeIndex] = 1)
      );

      const requestData = constructSypmtomsBinaryList;

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
      // Last step ==> reset
      setBodyPart("");
      setSymptomsList([]);
      setActiveStep(0);
    } else setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /* putting the above functions and variables inside of an object as "context" */
  const context = {
    data,
    bodyPart,
    symptomsList,
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
          variant="contained"
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
