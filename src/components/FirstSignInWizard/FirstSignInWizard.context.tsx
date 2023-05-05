import { type Professions, Roles, type Expertise } from "@prisma/client";
import useFirstSignInWizardState, {
  type ServiceAndLocation,
  type FirstSignInWizardState,
} from "./useFirstSignInWizardState";
import { createContext, useContext } from "react";
import { api } from "~/utils/api";

interface FirstSignInWizardContext {
  state: FirstSignInWizardState;
  onUserTypeChange: (role: Roles) => void;
  onProfessionChange: (profession: Professions) => void;
  onExpertiseChange: (expertise: Expertise[]) => void;
  onAvailabilityChange: (
    availability: FirstSignInWizardState["availability"]
  ) => void;
  onInterestsChange: (interests: Expertise[]) => void;
  onServiceSeekedChange: (serviceSeeked: Professions[]) => void;
  onAddService: (service: ServiceAndLocation) => void;
  onRemoveService: (serviceName: string) => void;
  onUpdateService: (service: ServiceAndLocation) => void;
  onSubmit: () => Promise<void>;
}

const firstSignInContext = createContext<FirstSignInWizardContext>(
  {} as FirstSignInWizardContext
);

export const useFirstSignInContext = () => {
  const context = useContext(firstSignInContext);

  if (!context.state) {
    throw new Error(
      "useFirstSignInContext must be used within a FirstSignInWizardProvider"
    );
  }

  return context;
};

const FirstSignInWizardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mutateAsync: addUser } = api.auth.add.useMutation();
  const { mutateAsync: addCustomer } = api.customer.add.useMutation({
    onSuccess: () => {
      // revalidate
    },
  });
  const { mutateAsync: addServiceProvider } =
    api.serviceProvider.add.useMutation({
      onSuccess: () => {
        // revalidate
      },
    });
  const [state, dispatch] = useFirstSignInWizardState();

  const onUserTypeChange = (role: Roles) => {
    dispatch({
      type: "type-of-user",
      payload: role,
    });
  };

  const onProfessionChange = (profession: Professions) => {
    dispatch({
      type: "type-of-service",
      payload: profession,
    });
  };

  const onExpertiseChange = (expertise: Expertise[]) => {
    dispatch({
      type: "expertise",
      payload: expertise,
    });
  };

  const onAvailabilityChange = (
    availability: FirstSignInWizardState["availability"]
  ) => {
    dispatch({
      type: "availability",
      payload: availability,
    });
  };

  const onInterestsChange = (interests: Expertise[]) => {
    dispatch({
      type: "interests",
      payload: interests,
    });
  };

  const onServiceSeekedChange = (serviceSeeked: Professions[]) => {
    dispatch({
      type: "service-seeked",
      payload: serviceSeeked,
    });
  };

  const onAddService = (service: ServiceAndLocation) => {
    dispatch({
      type: "add-service",
      payload: service,
    });
  };

  const onRemoveService = (serviceName: string) => {
    dispatch({
      type: "remove-service",
      payload: serviceName,
    });
  };

  const onUpdateService = (service: ServiceAndLocation) => {
    dispatch({
      type: "update-service",
      payload: service,
    });
  };

  const validateCustomer = () => {
    if (!state.interests.length) {
      alert("Please select at least one interest");
      return false;
    }

    if (state.serviceSeeked.length === 0) {
      alert("Please select at least one service");
      return false;
    }

    return true;
  };

  const validateServiceProvider = () => {
    if (!state.profession) {
      alert("Please select a profession");
      return false;
    }

    if (state.expertise.length === 0) {
      alert("Please select at least one expertise");
      return false;
    }

    if (state.availability.length === 0) {
      alert("Please select at least one availability");
      return false;
    }

    return true;
  };

  const submitCustomer = async () => {
    if (!validateCustomer()) {
      return;
    }
    await addUser({ role: Roles.CUSTOMER });
    const customer = await addCustomer({
      interests: state.interests,
      servicesSeeked: state.serviceSeeked,
    });

    console.log(customer);
    alert("Customer created successfully");
  };

  const submitServiceProvider = async () => {
    if (!validateServiceProvider()) {
      return;
    }

    await addUser({ role: Roles.SERVICE_PROVIDER });
    const serviceProvider = await addServiceProvider({
      profession: state.profession,
      expertise: state.expertise,
      availability: state.availability,
      services: state.services,
    });

    console.log(serviceProvider);
    alert("Service provider created successfully");
  };

  const onSubmit = async () => {
    if (state.userType === Roles.CUSTOMER) {
      await submitCustomer();
    } else {
      await submitServiceProvider();
    }
  };

  return (
    <firstSignInContext.Provider
      value={{
        state,
        onUserTypeChange,
        onProfessionChange,
        onExpertiseChange,
        onAvailabilityChange,
        onInterestsChange,
        onServiceSeekedChange,
        onAddService,
        onRemoveService,
        onUpdateService,
        onSubmit,
      }}
    >
      {children}
    </firstSignInContext.Provider>
  );
};

export default FirstSignInWizardProvider;
