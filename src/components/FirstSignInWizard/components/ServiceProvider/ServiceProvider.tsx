import { useFirstSignInContext } from "../../FirstSignInWizard.context";
import ProfessionsSelect from "./components/ProfessionsSelect/ProfessionsSelect";
import ExpertiseSelection from "../ExpertiseSelection/ExpertiseSelection";
import AvailabilitySelect from "./components/AvailabilitySelect/AvailailitySelect";
import { type ServiceAndLocation } from "../../useFirstSignInWizardState";
import { useState } from "react";

const initServiceState: ServiceAndLocation = {
  name: "",
  price: 0,
  duration: 0,
  location: {
    city: "",
    zip: "",
    address: "",
    country: "",
    state: "",
  },
};

const ServiceProviderServices = () => {
  const { onAddService, onUpdateService, onRemoveService, state } =
    useFirstSignInContext();
  const [formState, setFormState] = useState<"add" | "update">("add");
  const [service, setService] = useState<ServiceAndLocation>(initServiceState);

  const handleUpdateService = (serviceToUpdate: ServiceAndLocation) => {
    setFormState("update");
    setService(serviceToUpdate);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState === "update") {
      onUpdateService(service);
      setFormState("add");
    } else {
      onAddService(service);
    }
    setService(initServiceState);
  };

  return (
    <div>
      <h4>Add service</h4>
      <form onSubmit={handleSubmit}>
        <label htmlFor="service-name">Service name</label>
        <input
          type="text"
          id="service-name"
          name="service-name"
          value={service.name}
          onChange={(e) => setService({ ...service, name: e.target.value })}
        />
        <label htmlFor="service-price">Service price</label>
        <input
          type="number"
          id="service-price"
          name="service-price"
          value={service.price}
          onChange={(e) =>
            setService({ ...service, price: Number(e.target.value) })
          }
        />
        <label htmlFor="service-duration">Service duration</label>
        <input
          type="number"
          id="service-duration"
          name="service-duration"
          value={service.duration}
          onChange={(e) =>
            setService({ ...service, duration: Number(e.target.value) })
          }
        />
        <label htmlFor="service-location-country">
          Service location country
        </label>
        <input
          type="text"
          id="service-location-country"
          name="service-location-country"
          value={service.location.country}
          onChange={(e) =>
            setService({
              ...service,
              location: { ...service.location, country: e.target.value },
            })
          }
        />
        <label htmlFor="service-location-state">Service location state</label>
        <input
          type="text"
          id="service-location-state"
          name="service-location-state"
          value={service.location.state}
          onChange={(e) =>
            setService({
              ...service,
              location: { ...service.location, state: e.target.value },
            })
          }
        />
        <label htmlFor="service-location-city">Service location city</label>
        <input
          type="text"
          id="service-location-city"
          name="service-location-city"
          value={service.location.city}
          onChange={(e) =>
            setService({
              ...service,
              location: { ...service.location, city: e.target.value },
            })
          }
        />
        <label htmlFor="service-location-zip">Service location zip</label>
        <input
          type="text"
          id="service-location-zip"
          name="service-location-zip"
          value={service.location.zip}
          onChange={(e) =>
            setService({
              ...service,
              location: { ...service.location, zip: e.target.value },
            })
          }
        />
        <label htmlFor="service-location-address">
          Service location address
        </label>
        <input
          type="text"
          id="service-location-address"
          name="service-location-address"
          value={service.location.address}
          onChange={(e) =>
            setService({
              ...service,
              location: { ...service.location, address: e.target.value },
            })
          }
        />
        <button type="submit">
          {formState === "add" ? "Add service" : "Update service"}
        </button>
      </form>
      <h4>Services</h4>
      <ul>
        {state.services.map((service, index) => (
          <li key={index}>
            <p>{service.name}</p>
            <p>{service.price}</p>
            <p>{service.duration}</p>
            <p>{service.location.country}</p>
            <p>{service.location.state}</p>
            <p>{service.location.city}</p>
            <p>{service.location.zip}</p>
            <p>{service.location.address}</p>
            <button onClick={() => handleUpdateService(service)}>Update</button>
            <button onClick={() => onRemoveService(service.name)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ServiceProvider = () => {
  const { state, onProfessionChange, onExpertiseChange, onAvailabilityChange } =
    useFirstSignInContext();

  return (
    <div>
      <h3>Service Provider</h3>
      <p>Which type of service will you provider?</p>
      <ProfessionsSelect
        selectedProfession={state.profession}
        onProfessionChange={onProfessionChange}
      />
      <p>What is your expertise?</p>
      <ExpertiseSelection
        selectedExpertise={state.expertise}
        onExpertiseChange={onExpertiseChange}
      />
      <p>Choose you availability</p>
      <AvailabilitySelect
        availability={state.availability}
        onAvailabilityChange={onAvailabilityChange}
      />
      <p>Add services</p>
      <ServiceProviderServices />
    </div>
  );
};

export default ServiceProvider;
