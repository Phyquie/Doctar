'use client';

import { useEffect, useState } from 'react';

export default function BookingsList({ doctorId, patientId, title = 'Bookings', status, enableDoctorActions = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [planFor, setPlanFor] = useState(null); // booking object for planning home-visit
  const [planSlots, setPlanSlots] = useState([]); // array of time strings

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (doctorId) params.set('doctorId', doctorId);
        if (patientId) params.set('patientId', patientId);
        if (status) params.set('status', status);
        const res = await fetch(`/api/bookings?${params.toString()}`, { signal: controller.signal });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load bookings');
        setItems(data.bookings || []);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [doctorId, patientId, status]);

  const handleAction = async (bookingId, action) => {
    try {
      setBusyId(bookingId + ':' + action);
      setError('');
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) throw new Error('Not authenticated');
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId, action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      // Refresh list
      const params = new URLSearchParams();
      if (doctorId) params.set('doctorId', doctorId);
      if (patientId) params.set('patientId', patientId);
      if (status) params.set('status', status);
      const r2 = await fetch(`/api/bookings?${params.toString()}`);
      const d2 = await r2.json();
      setItems(d2.bookings || []);
    } catch (e) {
      setError(e.message || 'Failed to perform action');
    } finally {
      setBusyId('');
    }
  };

  const openPlanner = async (booking) => {
    try {
      setPlanFor(booking);
      setPlanSlots([]);
      // Preload availability with blockPending=false so only booked blocks are blocked
      const d = new Date(booking.slotStart);
      const dateStr = d.toISOString().slice(0,10);
      const res = await fetch(`/api/doctors/${booking.doctor._id || booking.doctor}/availability?date=${dateStr}&blockPending=false`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load availability');
      // Attach slots to planner booking
      setPlanFor({ ...booking, _daySlots: data.timeSlots || [], _dateStr: dateStr });
    } catch (e) {
      setError(e.message || 'Failed to load planner');
      setPlanFor(null);
    }
  };

  const togglePlanSlot = (time) => {
    // Keep contiguous selection only
    const exists = planSlots.includes(time);
    let next = exists ? planSlots.filter(t => t !== time) : [...planSlots, time];
    // Sort by time order (12h h:mm AM/PM). Use Date anchor 2000-01-01.
    next.sort((a,b) => new Date(`2000/01/01 ${a}`) - new Date(`2000/01/01 ${b}`));
    // Ensure contiguous 15-min steps if more than 1 selected
    const ok = next.length <= 1 || next.every((t, idx, arr) => idx === 0 || (new Date(`2000/01/01 ${t}`) - new Date(`2000/01/01 ${arr[idx-1]}`)) === 15*60*1000);
    if (!ok) return; // ignore non-contiguous clicks
    setPlanSlots(next);
  };

  const confirmPlan = async () => {
    if (!planFor || planSlots.length < 2) {
      setError('Select at least 30 minutes (2 slots)');
      return;
    }
    try {
      setBusyId(planFor._id + ':accept-plan');
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) throw new Error('Not authenticated');
      const startTime = planSlots[0];
      const blocks = planSlots.length;
      const acceptStartIso = new Date(`${planFor._dateStr} ${startTime}`).toISOString();
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId: planFor._id, action: 'accept', acceptStart: acceptStartIso, acceptBlocks: blocks })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to accept');
      setPlanFor(null);
      setPlanSlots([]);
      // Refresh list
      const params = new URLSearchParams();
      if (doctorId) params.set('doctorId', doctorId);
      if (patientId) params.set('patientId', patientId);
      if (status) params.set('status', status);
      const r2 = await fetch(`/api/bookings?${params.toString()}`);
      const d2 = await r2.json();
      setItems(d2.bookings || []);
    } catch (e) {
      setError(e.message || 'Failed to accept');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : error ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">No bookings found.</div>
      ) : (
        <div className="space-y-3">
          {items.map((b) => {
            const start = new Date(b.slotStart);
            const end = new Date(b.slotEnd);
            const dateStr = start.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            const timeStr = `${start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
            const guestName = b.guestPatient?.name;
            return (
              <div key={b._id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-[#5f4191] flex items-center justify-center font-semibold">
                    {doctorId ? (b.patient?.firstName?.[0] || 'P') : (b.doctor?.firstName?.[0] || 'D')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {doctorId ? `${b.patient?.firstName} ${b.patient?.lastName}` : `Dr. ${b.doctor?.firstName} ${b.doctor?.lastName}`}
                    </div>
                    <div className="text-sm text-gray-600">{dateStr} • {timeStr}</div>
                    <div className="text-xs text-gray-500 capitalize">{b.bookingType} • {b.visitType?.replace('-', ' ')}{guestName ? ` • For: ${guestName}` : ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    b.status === 'booked' ? 'bg-green-100 text-green-800' : b.status === 'cancelled' ? 'bg-red-100 text-red-800' : b.status === 'rejected' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {b.status}
                  </span>
                  {enableDoctorActions && b.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2.5 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        disabled={!!busyId}
                        onClick={() => b.bookingType === 'home-visit' ? openPlanner(b) : handleAction(b._id, 'accept')}
                      >
                        {busyId === b._id + ':accept' ? 'Accepting…' : b.bookingType === 'home-visit' ? 'Plan & Accept' : 'Accept'}
                      </button>
                      <button
                        className="px-2.5 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        disabled={!!busyId}
                        onClick={() => handleAction(b._id, 'reject')}
                      >
                        {busyId === b._id + ':reject' ? 'Rejecting…' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Simple inline planner for home-visit */}
      {planFor && (
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-700">Plan Home Visit for {planFor._dateStr}</div>
            <button className="text-sm text-gray-500 hover:text-gray-700" onClick={()=>{setPlanFor(null); setPlanSlots([]);}}>Close</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {(planFor._daySlots || []).map((s, idx) => (
              <button
                key={idx}
                disabled={!s.available}
                onClick={()=>togglePlanSlot(s.time)}
                className={`px-2 py-1 rounded border text-xs ${
                  planSlots.includes(s.time) ? 'bg-[#5f4191] text-white border-[#5f4191]' : s.available ? 'bg-white text-gray-800 border-gray-200 hover:border-[#5f4191]' : 'opacity-40 cursor-not-allowed border-gray-200'
                }`}
                title={s.available ? 'Select slot' : 'Unavailable'}
              >
                {s.time}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm disabled:opacity-50" disabled={planSlots.length<2 || !!busyId} onClick={confirmPlan}>
              {busyId === planFor._id + ':accept-plan' ? 'Confirming…' : `Confirm ${planSlots.length*15} min`}
            </button>
            <div className="text-xs text-gray-600">Select contiguous 15-min slots (minimum 30 min)</div>
          </div>
        </div>
      )}
    </div>
  );
}
