import { Expertise } from "@prisma/client";

interface Props {
  selectedExpertise: Expertise[];
  onExpertiseChange: (expertise: Expertise[]) => void;
}
const ExpertiseSelection = ({
  selectedExpertise,
  onExpertiseChange,
}: Props) => {
  const handleExpertiseChange = (expertise: Expertise) => {
    if (selectedExpertise.includes(expertise)) {
      onExpertiseChange(selectedExpertise.filter((e) => e !== expertise));
    } else {
      onExpertiseChange([...selectedExpertise, expertise]);
    }
  };

  return (
    <fieldset>
      <legend>Expertise</legend>
      {Object.values(Expertise).map((expertise) => (
        <div key={expertise}>
          <input
            type="checkbox"
            id={expertise}
            name="expertise"
            value={expertise}
            checked={selectedExpertise.includes(expertise)}
            onChange={() => handleExpertiseChange(expertise)}
          />
          <label htmlFor={expertise}>{expertise}</label>
        </div>
      ))}
    </fieldset>
  );
};

export default ExpertiseSelection;
