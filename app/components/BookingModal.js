'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectCurrentLocation } from '../store/slices/locationSlice';

export default function BookingModal({ open, onClose, doctor, onBooked }) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState({ timeSlots: [], available: false });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [visitType, setVisitType] = useState('first-time');
  const [bookingType, setBookingType] = useState('walk-in'); // 'walk-in' | 'home-visit'
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingFor, setBookingFor] = useState('myself'); // 'myself' | 'someone-else'
  const [guest, setGuest] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '', // DD/MM/YYYY or YYYY-MM-DD
    address: '',
    postalCode: '',
    city: '',
  });
  const [homeVisitAddress, setHomeVisitAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    landmark: '',
    fullText: '',
  });
  const currentLocation = useAppSelector(selectCurrentLocation);

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    if (!open || !doctor?.id || !date) return;
    const controller = new AbortController();
    const run = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        const res = await fetch(`/api/doctors/${doctor.id}/availability?date=${date}`, { signal: controller.signal });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load availability');
        setAvailability({ timeSlots: data.timeSlots || [], available: data.available });
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to load slots');
      } finally {
        setLoadingSlots(false);
      }
    };
    run();
    return () => controller.abort();
  }, [open, doctor?.id, date]);

  const handleSubmit = async () => {
    setError('');
    if (!selectedTime) {
      setError('Please select a time slot');
      return;
    }
    if (bookingType === 'home-visit') {
      const addrText = homeVisitAddress.fullText?.trim();
      const city = homeVisitAddress.city?.trim();
      if (!addrText || !city) {
        setError('For Home Visit, please enter full address and city');
        return;
      }
    }
    if (bookingFor === 'someone-else') {
      if (!guest.name || !guest.email || !guest.phone) {
        setError('Name, email, and phone are required for guest booking');
        return;
      }
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
      setError('Please login as a patient to book');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          date,
          time: selectedTime,
          bookingType,
          visitType,
          bookingFor,
          patientDetails: bookingFor === 'someone-else' ? guest : undefined,
          homeVisitAddress: bookingType === 'home-visit' ? {
            ...homeVisitAddress,
            fullText: homeVisitAddress.fullText?.trim() || [homeVisitAddress.line1, homeVisitAddress.line2, homeVisitAddress.city, homeVisitAddress.postalCode].filter(Boolean).join(', ')
          } : undefined,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create booking');
      onBooked?.(data.bookingId);
      onClose?.();
    } catch (e) {
      setError(e.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start md:items-center justify-center p-4 md:p-6 bg-black/50 overflow-y-auto">
      <div className={`w-full ${bookingFor === 'someone-else' ? 'max-w-3xl' : 'max-w-xl'} bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col`}>
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#5f4191] to-[#4d3374] text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Book Appointment</h3>
            <p className="text-sm opacity-90">Dr. {doctor?.firstName} {doctor?.lastName} • {doctor?.clinicName}</p>
          </div>
          <button onClick={onClose} className="text-white/90 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

  {/* Body */}
  <div className="p-6 space-y-5 flex-1 overflow-y-auto">
            {/* Booking For */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking For</label>
              <div className="inline-flex bg-gray-100 rounded-full p-1">
                {[
                  { id: 'myself', label: 'Myself' },
                  { id: 'someone-else', label: 'Someone else' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBookingFor(opt.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${bookingFor===opt.id ? 'bg-[#5f4191] text-white' : 'text-gray-700 hover:text-gray-900'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side: date, slots, visit type */}
              <div className="space-y-5">
                {/* Booking Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Mode</label>
                  <div className="flex items-center gap-3">
                    {[
                      { id: 'walk-in', label: 'Walk-in/Clinic' },
                      { id: 'home-visit', label: 'Home Visit' },
                    ].map(v => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setBookingType(v.id)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${bookingType===v.id ? 'bg-purple-100 border-[#5f4191] text-[#5f4191]' : 'bg-white border-gray-200 text-gray-800 hover:border-[#5f4191]'}`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                    value={date}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => { setSelectedTime(null); setDate(e.target.value); }}
                  />
                </div>

                {/* Slots */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Available Time Slots</label>
                    {loadingSlots && <span className="text-xs text-gray-500">Loading…</span>}
                  </div>
                  {error && (
                    <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
                  )}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                    {(availability?.timeSlots || []).map((slot, idx) => {
                      const disabled = slot.booked || !slot.available;
                      const active = selectedTime === slot.time;
                      return (
                        <button
                          key={idx}
                          disabled={disabled}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`px-3 py-2 rounded-lg text-sm border transition-all
                            ${active ? 'bg-[#5f4191] text-white border-[#5f4191]' : 'bg-white text-gray-800 border-gray-200 hover:border-[#5f4191]'}
                            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                          title={disabled ? (slot.booked ? 'Booked' : 'Unavailable') : 'Select time'}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                    {(!availability?.timeSlots || availability.timeSlots.length === 0) && !loadingSlots && (
                      <div className="col-span-3 sm:col-span-4 text-sm text-gray-500">No slots available for this day.</div>
                    )}
                  </div>
                </div>

                {/* Visit Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visit Type</label>
                  <div className="flex items-center gap-3">
                    {['first-time','follow-up'].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVisitType(v)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${visitType===v ? 'bg-purple-100 border-[#5f4191] text-[#5f4191]' : 'bg-white border-gray-200 text-gray-800 hover:border-[#5f4191]'}`}
                      >
                        {v === 'first-time' ? 'First time' : 'Follow up'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side: guest form */}
              {bookingType === 'home-visit' ? (
                <div className="space-y-3 min-w-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address*</label>
                    <textarea value={homeVisitAddress.fullText} onChange={e=>setHomeVisitAddress({...homeVisitAddress, fullText:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="House/Flat, Street, Area"></textarea>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                      <input value={homeVisitAddress.city} onChange={e=>setHomeVisitAddress({...homeVisitAddress, city:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input value={homeVisitAddress.postalCode} onChange={e=>setHomeVisitAddress({...homeVisitAddress, postalCode:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="Postal code" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                      <input value={homeVisitAddress.landmark} onChange={e=>setHomeVisitAddress({...homeVisitAddress, landmark:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="Nearby landmark" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                      <input value={homeVisitAddress.line1} onChange={e=>setHomeVisitAddress({...homeVisitAddress, line1:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="Optional line 1" />
                    </div>
                  </div>
                </div>
              ) : bookingFor === 'someone-else' ? (
                <div className="space-y-3 min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                      <input value={guest.name} onChange={e=>setGuest({...guest, name:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                      <input type="email" value={guest.email} onChange={e=>setGuest({...guest, email:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="example@domain.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                      <input value={guest.phone} onChange={e=>setGuest({...guest, phone:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="+91 xxxxx xxxxx" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                      <div className="flex gap-3">
                        {['male','female'].map(g => (
                          <button key={g} type="button" onClick={()=>setGuest({...guest, gender:g})}
                            className={`flex-1 border rounded-lg py-2 ${guest.gender===g ? 'border-[#5f4191] bg-purple-50' : 'border-gray-300'}`}>{g.charAt(0).toUpperCase()+g.slice(1)}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DOB</label>
                      <input value={guest.dob} onChange={e=>setGuest({...guest, dob:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="DD/MM/YYYY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input value={guest.postalCode} onChange={e=>setGuest({...guest, postalCode:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="Postal code" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <div className="flex gap-2 flex-col sm:flex-row min-w-0">
                        <input value={guest.city} onChange={e=>setGuest({...guest, city:e.target.value})} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="City" />
                        <button type="button" onClick={()=>setGuest({...guest, city: (currentLocation?.city || guest.city || '')})} className="px-3 py-2 border border-[#5f4191] text-[#5f4191] rounded-lg hover:bg-[#5f4191] hover:text-white whitespace-nowrap mt-2 sm:mt-0">Use current</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input value={guest.address} onChange={e=>setGuest({...guest, address:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]" placeholder="Enter address" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:block" />
              )}
            </div>
          </div>
  <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] disabled:opacity-50"
          >
            {submitting ? 'Sending…' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
