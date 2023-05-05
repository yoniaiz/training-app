import { Professions } from "@prisma/client";
import ExpertiseSelection from "../ExpertiseSelection/ExpertiseSelection";
import { useFirstSignInContext } from "../../FirstSignInWizard.context";

const Customer = () => {
  const { state, onInterestsChange, onServiceSeekedChange } =
    useFirstSignInContext();

  const handleServiceSeekedChange = (profession: Professions) => {
    const serviceSeeked = state.serviceSeeked.includes(profession)
      ? state.serviceSeeked.filter((p) => p !== profession)
      : [...state.serviceSeeked, profession];

    onServiceSeekedChange(serviceSeeked);
  };
  return (
    <div>
      <h3>Customer</h3>
      <p>What type of service are you looking for?</p>
      {Object.values(Professions).map((profession) => (
        <div key={profession}>
          <input
            type="checkbox"
            id={profession}
            name="profession"
            value={profession}
            checked={state.serviceSeeked.includes(profession)}
            onChange={() => handleServiceSeekedChange(profession)}
          />
          <label htmlFor={profession}>{profession}</label>
        </div>
      ))}
      <p>What is your expertise?</p>
      <ExpertiseSelection
        selectedExpertise={state.interests}
        onExpertiseChange={onInterestsChange}
      />
    </div>
  );
};

export default Customer;
