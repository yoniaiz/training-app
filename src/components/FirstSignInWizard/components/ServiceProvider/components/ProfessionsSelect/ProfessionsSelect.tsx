import { Professions } from "@prisma/client";

interface Props {
  selectedProfession: Professions;
  onProfessionChange: (profession: Professions) => void;
}
const ProfessionsSelect = ({
  onProfessionChange,
  selectedProfession,
}: Props) => {
  return (
    <select
      value={selectedProfession}
      onChange={(e) => onProfessionChange(e.target.value as Professions)}
    >
      {Object.values(Professions).map((profession) => (
        <option key={profession} value={profession}>
          {profession}
        </option>
      ))}
    </select>
  );
};

export default ProfessionsSelect;
