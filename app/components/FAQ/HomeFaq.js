import React from 'react';
import DynamicFAQ from '../FAQ/DynamicFAQ';
import { useSelector } from 'react-redux';
import { selectCurrentLocation } from '../../store/slices/locationSlice';

const HomeFAQ = () => {
  const currentLocation = useSelector(selectCurrentLocation);
  console.log('Current Location in HomeFAQ:', currentLocation);

  return (
    <div className="bg-gradient-to-b from-[#7551B2] to-[#5a3d8a] w-full py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">FAQ's</h1>
          <p className="text-white/80">Get answers to common questions about Doctar in {currentLocation?.name || 'your area'}</p>
        </div>
        
        {/* Custom styled FAQ for homepage */}
        <div className="p-6">
          <DynamicFAQ
            categories={['general', 'patients', 'doctors']}
            location={currentLocation?.name}
            specialty={null}
            maxItems={8}
            title=""
            searchable={false}
            className="bg-transparent shadow-none border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeFAQ;
