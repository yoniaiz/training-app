import { Roles } from "@prisma/client";
import FirstSignInWizardProvider, {
  useFirstSignInContext,
} from "./FirstSignInWizard.context";
import SelectUserType from "./components/SelectUserType/SelectUserType";
import Customer from "./components/Customer/Customer";
import ServiceProvider from "./components/ServiceProvider/ServiceProvider";
import { Button, Container, Typography } from "@mui/material";

const FirstSignInWizardInner = () => {
  const { state, onSubmit } = useFirstSignInContext();

  const handleSubmit = async () => {
    await onSubmit();
  };

  return (
    <Container
      sx={{
        height: "100%",
      }}
    >
      <Typography variant="h1">Welcome!</Typography>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit
      </Button>
      <SelectUserType />

      {state.userType === Roles.CUSTOMER ? <Customer /> : <ServiceProvider />}
    </Container>
  );
};

const FirstSignInWizard = () => {
  return (
    <FirstSignInWizardProvider>
      <FirstSignInWizardInner />
    </FirstSignInWizardProvider>
  );
};

export default FirstSignInWizard;
