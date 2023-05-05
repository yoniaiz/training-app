import { Day, Time } from "@prisma/client";
import { type DayAndTime } from "~/components/FirstSignInWizard/useFirstSignInWizardState";

export type AvailabilitySelectProps = {
  onAvailabilityChange: (availability: DayAndTime[]) => void;
  availability: DayAndTime[];
};

const AvailabilitySelect = ({
  onAvailabilityChange,
  availability,
}: AvailabilitySelectProps) => {
  const handleAvailabilityDayChange = (day: DayAndTime["day"]) => {
    if (availability.some((a) => a.day === day)) {
      onAvailabilityChange(availability.filter((a) => a.day !== day));
    } else {
      onAvailabilityChange([
        ...availability,
        { day, time: Object.values(Time) },
      ]);
    }
  };

  const findAvailability = (day: DayAndTime["day"]) =>
    availability.find((a) => a.day === day);

  const handleAvailabilityTimeChange = (
    day: DayAndTime["day"],
    time: DayAndTime["time"][0]
  ) => {
    const updatedAvailability = findAvailability(day);
    if (updatedAvailability) {
      if (updatedAvailability.time.includes(time)) {
        onAvailabilityChange(
          availability.map((a) =>
            a.day === day ? { day, time: a.time.filter((t) => t !== time) } : a
          )
        );
      } else {
        onAvailabilityChange(
          availability.map((a) =>
            a.day === day ? { day, time: [...a.time, time] } : a
          )
        );
      }
    }
  };

  return (
    <>
      {Object.values(Day).map((day) => {
        const availability = findAvailability(day);
        return (
          <div key={day}>
            <input
              type="checkbox"
              id={day}
              name="availability"
              value={day}
              checked={!!availability}
              onChange={() => handleAvailabilityDayChange(day)}
            />
            <label htmlFor={day}>{day}</label>
            <div
              style={{
                marginLeft: "20px",
              }}
            >
              {Object.values(Time).map((time) => (
                <div key={`${day}_${time}`}>
                  <input
                    type="checkbox"
                    id={`${day}-${time}`}
                    name={`${day}-availability-time`}
                    value={`${day}-${time}`}
                    checked={availability?.time.includes(time) || false}
                    onChange={() => handleAvailabilityTimeChange(day, time)}
                  />
                  <label htmlFor={`${day}-${time}`}>{time}</label>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AvailabilitySelect;
