import {
  Professions,
  Roles,
  type Expertise,
  type Service as PService,
  Day,
  Time,
  type Availability,
  type Location,
} from "@prisma/client";
import { useReducer } from "react";

export type DayAndTime = Pick<Availability, "time" | "day">;

export type PartialLocation = Pick<
  Location,
  "address" | "city" | "country" | "state" | "zip"
>;

export type ServiceAndLocation = Pick<
  PService,
  "name" | "price" | "duration"
> & {
  location: PartialLocation;
};

export interface FirstSignInWizardState {
  userType: Roles;
  profession: Professions;
  expertise: Expertise[];
  availability: DayAndTime[];
  interests: Expertise[];
  serviceSeeked: Professions[];
  services: ServiceAndLocation[];
}

const getFullAvailability = () =>
  Object.values(Day).map(
    (day) =>
      ({
        day,
        time: Object.values(Time),
      } as DayAndTime)
  );

const initialState: FirstSignInWizardState = {
  userType: Roles.CUSTOMER,
  profession: Professions.TRAINER,
  expertise: [],
  availability: getFullAvailability(),
  interests: [],
  serviceSeeked: [],
  services: [],
};

type TypeOfUserAction = {
  type: "type-of-user";
  payload: Roles;
};

type professionAction = {
  type: "type-of-service";
  payload: Professions;
};

type ExpertiseAction = {
  type: "expertise";
  payload: Expertise[];
};

type AvailabilityAction = {
  type: "availability";
  payload: DayAndTime[];
};

type InterestsAction = {
  type: "interests";
  payload: Expertise[];
};

type ServiceSeekedAction = {
  type: "service-seeked";
  payload: Professions[];
};

type AddServiceAction = {
  type: "add-service";
  payload: ServiceAndLocation;
};

type RemoveServiceAction = {
  type: "remove-service";
  payload: string;
};

type UpdateServiceAction = {
  type: "update-service";
  payload: ServiceAndLocation;
};

type Actions =
  | TypeOfUserAction
  | professionAction
  | ExpertiseAction
  | AvailabilityAction
  | InterestsAction
  | ServiceSeekedAction
  | AddServiceAction
  | RemoveServiceAction
  | UpdateServiceAction;

const reducer = (
  state: FirstSignInWizardState,
  action: Actions
): FirstSignInWizardState => {
  switch (action.type) {
    case "type-of-user":
      return {
        ...initialState,
        userType: action.payload,
      };

    case "type-of-service":
      return {
        ...state,
        profession: action.payload,
      };

    case "expertise":
      return {
        ...state,
        expertise: action.payload,
      };

    case "availability":
      return {
        ...state,
        availability: action.payload,
      };

    case "interests":
      return {
        ...state,
        interests: action.payload,
      };

    case "service-seeked":
      return {
        ...state,
        serviceSeeked: action.payload,
      };

    case "add-service":
      return {
        ...state,
        services: [...state.services, action.payload],
      };

    case "remove-service":
      return {
        ...state,
        services: state.services.filter(
          (service) => service.name !== action.payload
        ),
      };

    case "update-service":
      return {
        ...state,
        services: state.services.map((service) => {
          if (service.name === action.payload.name) {
            return action.payload;
          }
          return service;
        }),
      };

    default:
      return state;
  }
};

const useFirstSignInWizardState = () => useReducer(reducer, initialState);

export default useFirstSignInWizardState;
