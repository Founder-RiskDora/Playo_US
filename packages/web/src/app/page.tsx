'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ActivityCard from '@/components/ActivityCard';

interface Activity {
  id: string;
  title: string;
  courtName: string;
  address: string;
  dateTimeStart: string;
  maxPlayers: number;
  currentPlayerCount?: number;
  status: string;
  host?: { name: string };
}

export default function DiscoverPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/activities')
      .then(setActivities)
      .catch(() => setError('Failed to load activities'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Discover Games</h1>
        <a href="/activities/new" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
          + Host a Game
        </a>
      </div>
      {loading && <p className="text-gray-500">Loading activities...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map(a => <ActivityCard key={a.id} activity={a} />)}
      </div>
      {!loading && activities.length === 0 && (
        <p className="text-gray-500 text-center py-12">No games found. Be the first to host one!</p>
      )}
    </div>
  );
}
