import { Roles } from "@prisma/client";
import { useFirstSignInContext } from "../../FirstSignInWizard.context";

const SelectUserType = () => {
  const { onUserTypeChange, state } = useFirstSignInContext();

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUserTypeChange(e.target.value as Roles);
  };

  return (
    <fieldset>
      <legend>Are you here to</legend>

      <div>
        <input
          type="radio"
          id="customer"
          name="user-type"
          value={Roles.CUSTOMER}
          onChange={handleUserTypeChange}
          checked={state.userType === Roles.CUSTOMER}
        />
        <label htmlFor="customer">Find service</label>
      </div>

      <div>
        <input
          type="radio"
          id="service-provider"
          name="user-type"
          value={Roles.SERVICE_PROVIDER}
          onChange={handleUserTypeChange}
          checked={state.userType === Roles.SERVICE_PROVIDER}
        />
        <label htmlFor="service-provider">Provide service</label>
      </div>
    </fieldset>
  );
};

export default SelectUserType;
