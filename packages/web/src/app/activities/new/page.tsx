'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function NewActivityPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    courtName: '',
    address: '',
    dateTimeStart: '',
    dateTimeEnd: '',
    maxPlayers: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'maxPlayers' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const activity = await api.post('/activities', form);
      router.push(`/activities/${activity.id}`);
    } catch (e: any) {
      setError(e.message || 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Host a Game</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {[
          { label: 'Title', name: 'title', type: 'text', placeholder: 'e.g. Sunday Doubles at Smash Center' },
          { label: 'Court Name', name: 'courtName', type: 'text', placeholder: 'Smash Center Court 2' },
          { label: 'Address', name: 'address', type: 'text', placeholder: '123 Main St, San Francisco, CA' },
          { label: 'Start Time', name: 'dateTimeStart', type: 'datetime-local', placeholder: '' },
          { label: 'End Time', name: 'dateTimeEnd', type: 'datetime-local', placeholder: '' },
          { label: 'Max Players', name: 'maxPlayers', type: 'number', placeholder: '10' },
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <input
              name={field.name}
              type={field.type}
              value={(form as any)[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required
              min={field.name === 'maxPlayers' ? 2 : undefined}
              max={field.name === 'maxPlayers' ? 50 : undefined}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Skill level expected, format (doubles/singles), cost split info..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Game'}
        </button>
      </form>
    </div>
  );
}
