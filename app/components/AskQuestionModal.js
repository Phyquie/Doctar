"use client";

import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectUser, selectRole } from '../store/slices/authSlice';

const SPECIALISTS = [
  'Cardiologist','Dermatologist','Orthopedic','Neurologist','Psychiatrist',
  'Dentist','Gynecologist','Pediatrician','ENT','General Physician'
];

export default function AskQuestionModal({ isOpen, onClose }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectRole);

  const [specialist, setSpecialist] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }
    if (!specialist || !question.trim()) {
      setError('Please choose a specialist and write your question.');
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ specialist, question })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit your question');
      } else {
        setSuccess('Question submitted successfully. Our team will email you the reply.');
        setSpecialist('');
        setQuestion('');
        setTimeout(() => onClose(), 1200);
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Ask a Question</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {!isAuthenticated ? (
          <div className="p-6">
            <p className="text-gray-700 mb-4">You need to be logged in to ask a question.</p>
            <a href="/auth/login" className="inline-flex items-center px-4 py-2 rounded-md bg-[#5f4191] text-white hover:bg-[#4d3374]">Login</a>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm text-gray-600">Select specialist</label>
              <select value={specialist} onChange={(e)=>setSpecialist(e.target.value)} className="mt-1 w-full border rounded-md p-2 focus:ring-[#5f4191] focus:border-[#5f4191]">
                <option value="">Choose specialist</option>
                {SPECIALISTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Your question</label>
              <textarea value={question} onChange={(e)=>setQuestion(e.target.value)} rows={5} className="mt-1 w-full border rounded-md p-2 focus:ring-[#5f4191] focus:border-[#5f4191]" placeholder="Type your question here..."></textarea>
              <div className="text-xs text-gray-500 mt-1">Max 2000 characters</div>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
              <button disabled={isSubmitting} onClick={handleSubmit} className="px-5 py-2 rounded-md bg-[#5f4191] text-white hover:bg-[#4d3374] disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
