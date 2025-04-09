// components/TutorialStep.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faDollarSign, faTicketAlt } from '@fortawesome/free-solid-svg-icons';

const TutorialStep = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="text-blue-600 mb-4">
        <FontAwesomeIcon icon={icon} size="3x" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default TutorialStep;
