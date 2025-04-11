// components/Tutorial.js
import TutorialStep from './tutorialSteps';
import { faQrcode, faTicketAlt,faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Tutorial = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      <TutorialStep 
        title="Step 1: Scan QR Code" 
        description="Scan the QR code to get started."
        icon={faQrcode}
      />
      <TutorialStep 
        title="Step 2: Enter Billing Amount" 
        description="Enter the required billing amount for your transaction."
        icon={faDollarSign}
      />
      <TutorialStep 
        title="Step 3: Use Scratch Card" 
        description="Scratch the card to reveal your discount or offer."
        icon={faTicketAlt}
      />
    </div>
  );
};

export default Tutorial;
