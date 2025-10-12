"use client";

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAppSelector } from '../../store/hooks';
import { selectRole } from '../../store/slices/authSlice';

export default function AdminQuestionsPage() {
  const role = useAppSelector(selectRole);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/admin/questions', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setItems(data.data || []); else setError(data.error || 'Failed to fetch');
    } catch (e) {
      setError('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const sendReply = async (id) => {
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/admin/questions/${id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reply: replyText })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to reply');
      setSuccess('Reply sent');
      setReplyingId(null);
      setReplyText('');
      fetchItems();
    } catch(e) {
      setError('Failed to reply');
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Questions</h1>
        {loading ? <div>Loading...</div> : (
          <div className="space-y-4">
            {error && <div className="text-red-600">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}
            {items.length === 0 ? <div>No items</div> : items.map(q => (
              <div key={q._id} className="bg-white rounded-lg border p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-medium">{q.name} <span className="text-gray-500 text-sm">({q.email})</span></div>
                    <div className="text-sm text-gray-600">Specialist: {q.specialist}</div>
                    <div className="mt-2 text-gray-800 whitespace-pre-wrap">{q.question}</div>
                    {q.reply && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                        <div className="text-sm font-medium text-green-700">Reply</div>
                        <div className="text-sm text-green-800 whitespace-pre-wrap">{q.reply}</div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm"><span className="px-2 py-1 rounded bg-gray-100">{q.status}</span></div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {replyingId === q._id ? (
                    <>
                      <textarea rows={3} className="w-full border rounded p-2" value={replyText} onChange={(e)=>setReplyText(e.target.value)} placeholder="Type reply..." />
                      <button className="px-3 py-2 bg-[#5f4191] text-white rounded" onClick={()=>sendReply(q._id)}>Send</button>
                      <button className="px-3 py-2 border rounded" onClick={()=>{setReplyingId(null); setReplyText('');}}>Cancel</button>
                    </>
                  ) : (
                    <button className="px-3 py-2 border rounded" onClick={()=>setReplyingId(q._id)}>Reply</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
