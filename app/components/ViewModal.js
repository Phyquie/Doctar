'use client';

import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ViewModal = ({ isOpen, onClose, data, type, onStatusChange }) => {
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null,
    action: null
  });
  
  console.log('ViewModal props:', { isOpen, data: data?._id, type, onStatusChange: typeof onStatusChange });
  
  if (!isOpen) return null;

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  };

  const getStatusBadge = (item) => {
    if (type === 'doctor') {
      if (item.isSuspended) {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspended</span>;
      } else if (item.isActive && item.isEmailVerified) {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      } else if (!item.isEmailVerified) {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      } else {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      }
    } else {
      if (item.isSuspended) {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspended</span>;
      } else if (item.isActive && item.isEmailVerified) {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      } else if (!item.isEmailVerified) {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Unverified</span>;
      } else {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>;
      }
    }
  };

  const handleAction = (action) => {
    console.log('ViewModal action clicked:', { action, dataId: data?._id });
    setConfirmationModal({
      isOpen: true,
      type: action === 'delete' ? 'danger' : 'warning',
      action: action
    });
  };

  const handleConfirmAction = async (reason) => {
    try {
      console.log('ViewModal handleConfirmAction called:', { action: confirmationModal.action, reason, onStatusChange: typeof onStatusChange });
      await onStatusChange(confirmationModal.action, reason);
      setConfirmationModal({ isOpen: false, type: null, action: null });
    } catch (error) {
      console.error('Action failed:', error);
      alert(error.message || 'Action failed. Please try again.');
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationModal({ isOpen: false, type: null, action: null });
  };

  const getActionButtons = () => {
    if (!data) return null;

    const buttons = [];

    // Delete button (always available)
    buttons.push(
      <button
        key="delete"
        onClick={() => handleAction('delete')}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Delete
      </button>
    );

    // Status-based buttons
    if (data.isSuspended) {
      // If suspended, show re-approve button
      buttons.push(
        <button
          key="reapprove"
          onClick={() => handleAction('reapprove')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Re-approve
        </button>
      );
    } else if (data.isActive && data.isEmailVerified) {
      // If approved, show suspend button
      buttons.push(
        <button
          key="suspend"
          onClick={() => handleAction('suspend')}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Suspend
        </button>
      );
    } else if (!data.isEmailVerified) {
      // If pending, show approve button
      buttons.push(
        <button
          key="approve"
          onClick={() => handleAction('approve')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Approve
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {type === 'doctor' ? 'Doctor Details' : 'User Details'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 ${type === 'doctor' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                  <span className={`text-lg font-medium ${type === 'doctor' ? 'text-green-800' : 'text-blue-800'}`}>
                    {getInitials(data.firstName, data.lastName)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900">
                    {type === 'doctor' ? 'Dr. ' : ''}{data.firstName} {data.lastName}
                  </h4>
                  <p className="text-gray-600">{data.email}</p>
                  <p className="text-gray-600">{data.phone}</p>
                  <div className="mt-2">
                    {getStatusBadge(data)}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {type === 'doctor' ? (
                  <>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Professional Information</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Specialization:</span>
                          <span className="ml-2 text-gray-900">{data.specialization || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Qualification:</span>
                          <span className="ml-2 text-gray-900">{data.qualification || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Experience:</span>
                          <span className="ml-2 text-gray-900">{data.experience || 0} years</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Consultation Fee:</span>
                          <span className="ml-2 text-gray-900">₹{data.consultationFee || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Clinic Information</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Clinic Name:</span>
                          <span className="ml-2 text-gray-900">{data.clinicName || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 text-gray-900">{data.location || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Clinic Address:</span>
                          <span className="ml-2 text-gray-900">{data.clinicAddress || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Personal Information</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Date of Birth:</span>
                          <span className="ml-2 text-gray-900">
                            {data.dateOfBirth ? formatDate(data.dateOfBirth) : 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Gender:</span>
                          <span className="ml-2 text-gray-900 capitalize">{data.gender || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Language:</span>
                          <span className="ml-2 text-gray-900">{data.language || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Account Information</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Email Verified:</span>
                          <span className={`ml-2 ${data.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                            {data.isEmailVerified ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone Verified:</span>
                          <span className={`ml-2 ${data.isPhoneVerified ? 'text-green-600' : 'text-red-600'}`}>
                            {data.isPhoneVerified ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Joined:</span>
                          <span className="ml-2 text-gray-900">{formatDate(data.createdAt)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Login:</span>
                          <span className="ml-2 text-gray-900">
                            {data.lastLogin ? formatDate(data.lastLogin) : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Personal Information</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Date of Birth:</span>
                          <span className="ml-2 text-gray-900">
                            {data.dateOfBirth ? formatDate(data.dateOfBirth) : 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Gender:</span>
                          <span className="ml-2 text-gray-900 capitalize">{data.gender || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Blood Group:</span>
                          <span className="ml-2 text-gray-900">{data.bloodGroup || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Language:</span>
                          <span className="ml-2 text-gray-900">{data.language || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 text-gray-900">{data.location || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <span className="ml-2 text-gray-900">{data.address || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Emergency Contact:</span>
                          <span className="ml-2 text-gray-900">{data.emergencyContact || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Medical Information</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Allergies:</span>
                          <span className="ml-2 text-gray-900">{data.allergies || 'None reported'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Medical History:</span>
                          <span className="ml-2 text-gray-900">{data.medicalHistory || 'None reported'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Account Information</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Email Verified:</span>
                          <span className={`ml-2 ${data.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                            {data.isEmailVerified ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone Verified:</span>
                          <span className={`ml-2 ${data.isPhoneVerified ? 'text-green-600' : 'text-red-600'}`}>
                            {data.isPhoneVerified ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Joined:</span>
                          <span className="ml-2 text-gray-900">{formatDate(data.createdAt)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Login:</span>
                          <span className="ml-2 text-gray-900">
                            {data.lastLogin ? formatDate(data.lastLogin) : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bio Section (for doctors) */}
              {type === 'doctor' && data.bio && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Bio</h5>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{data.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:w-auto sm:text-sm"
            >
              Close
            </button>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 mt-3 sm:mt-0">
              {getActionButtons()}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmAction}
        title={
          confirmationModal.action === 'delete' 
            ? `Delete ${type === 'doctor' ? 'Doctor' : 'User'}`
            : confirmationModal.action === 'suspend'
            ? `Suspend ${type === 'doctor' ? 'Doctor' : 'User'}`
            : confirmationModal.action === 'approve'
            ? `Approve ${type === 'doctor' ? 'Doctor' : 'User'}`
            : `Re-approve ${type === 'doctor' ? 'Doctor' : 'User'}`
        }
        message={
          confirmationModal.action === 'delete'
            ? `Are you sure you want to permanently delete ${data?.firstName} ${data?.lastName}? This action cannot be undone.`
            : confirmationModal.action === 'suspend'
            ? `Are you sure you want to suspend ${data?.firstName} ${data?.lastName}? This will deactivate their account.`
            : confirmationModal.action === 'approve'
            ? `Are you sure you want to approve ${data?.firstName} ${data?.lastName}? This will activate their account.`
            : `Are you sure you want to re-approve ${data?.firstName} ${data?.lastName}? This will reactivate their account.`
        }
        confirmText={
          confirmationModal.action === 'delete' ? 'Delete' :
          confirmationModal.action === 'suspend' ? 'Suspend' :
          confirmationModal.action === 'approve' ? 'Approve' : 'Re-approve'
        }
        type={confirmationModal.type}
        showReasonInput={true}
        reasonPlaceholder={`Enter reason for ${confirmationModal.action}...`}
      />
    </div>
  );
};

export default ViewModal;
