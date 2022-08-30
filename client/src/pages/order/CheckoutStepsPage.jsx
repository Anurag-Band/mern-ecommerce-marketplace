import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Shipping from "../../components/order/Shipping";
import ConfirmOrder from "../../components/order/ConfirmOrder";
import Payment from "../../components/order/Payment";

const steps = ["Shipping Details", "Confirm Order", "Payment"];

const CheckoutStepsPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  function _renderStepContent(step) {
    switch (step) {
      case 0:
        return <Shipping />;
      case 1:
        return <ConfirmOrder />;
      case 2:
        return <Payment />;
      default:
        return <div>Not Found</div>;
    }
  }

  return (
    <Box sx={{ width: "100%" }} className="container mx-auto w-4/5 p-5">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {_renderStepContent(activeStep)}
          <Box sx={{ marginLeft: "auto", marginRight: "auto", width: "10%" }}>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export default CheckoutStepsPage;
