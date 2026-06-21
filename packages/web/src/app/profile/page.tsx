'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  skillLevel: string;
  city?: string;
  profilePhoto?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', skillLevel: '', city: '' });

  useEffect(() => {
    api.get('/users/me').then(u => {
      setUser(u);
      setForm({ name: u.name, skillLevel: u.skillLevel, city: u.city || '' });
    }).catch(() => {});
  }, []);

  const save = async () => {
    const updated = await api.patch('/users/me', form);
    setUser(updated);
    setEditing(false);
  };

  if (!user) return <p className="text-gray-500">Please log in to view your profile.</p>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">
            {user.name[0]}
          </div>
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Name" />
            <select value={form.skillLevel} onChange={e => setForm(p => ({ ...p, skillLevel: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="City" />
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium">Save</button>
              <button onClick={() => setEditing(false)} className="flex-1 border py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Skill Level:</span> {user.skillLevel}</p>
            <p><span className="font-medium">City:</span> {user.city || '—'}</p>
            <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
            <button onClick={() => setEditing(true)} className="mt-2 border border-primary text-primary px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
