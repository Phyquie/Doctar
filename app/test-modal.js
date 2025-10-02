'use client';

import React, { useState } from 'react';
import ConfirmationModal from './components/ConfirmationModal';

const TestModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async (reason) => {
    console.log('Test confirm called with reason:', reason);
    alert(`Confirmed with reason: ${reason}`);
    setIsOpen(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Modal</h1>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Test Modal
      </button>
      
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Test Modal"
        message="This is a test modal to verify functionality."
        confirmText="Confirm Test"
        type="warning"
        showReasonInput={true}
        reasonPlaceholder="Enter test reason..."
      />
    </div>
  );
};

export default TestModal;
