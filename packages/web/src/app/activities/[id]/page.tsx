'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Participant {
  id: string;
  user: { id: string; name: string; skillLevel: string; profilePhoto?: string };
  role: string;
}

interface ActivityDetail {
  id: string;
  title: string;
  description: string;
  courtName: string;
  address: string;
  dateTimeStart: string;
  dateTimeEnd: string;
  maxPlayers: number;
  status: string;
  host: { id: string; name: string };
  participants: Participant[];
  currentPlayerCount: number;
}

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/activities/${id}`).then(setActivity).finally(() => setLoading(false));
  }, [id]);

  const requestToJoin = async () => {
    setRequesting(true);
    try {
      await api.post(`/activities/${id}/join-requests`, {});
      setMessage('Join request sent! The host will review your request.');
    } catch (e: any) {
      setMessage(e.message || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!activity) return <p className="text-red-500">Activity not found</p>;

  const spotsLeft = activity.maxPlayers - activity.currentPlayerCount;
  const isFull = spotsLeft <= 0;

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{activity.title}</h1>
            <p className="text-sm text-gray-500">Hosted by {activity.host?.name}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <p><span className="font-medium">Venue:</span> {activity.courtName}</p>
          <p><span className="font-medium">Address:</span> {activity.address}</p>
          <p><span className="font-medium">Start:</span> {new Date(activity.dateTimeStart).toLocaleString()}</p>
          <p><span className="font-medium">End:</span> {new Date(activity.dateTimeEnd).toLocaleString()}</p>
          <p><span className="font-medium">Players:</span> {activity.currentPlayerCount} / {activity.maxPlayers}</p>
        </div>

        {activity.description && (
          <div className="mb-4">
            <h3 className="font-medium mb-1">About this game</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{activity.description}</p>
          </div>
        )}

        {message && <p className="text-sm text-green-600 mb-3">{message}</p>}
        {!isFull && (
          <button
            onClick={requestToJoin}
            disabled={requesting}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {requesting ? 'Sending request...' : 'Request to Join'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold mb-3">Roster ({activity.currentPlayerCount})</h2>
        {activity.participants?.length === 0 && <p className="text-sm text-gray-500">No players yet</p>}
        <div className="space-y-2">
          {activity.participants?.map(p => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-700">
                {p.user.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{p.user.name} {p.role === 'Host' && <span className="text-xs text-gray-400">(Host)</span>}</p>
                <p className="text-xs text-gray-400">{p.user.skillLevel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
