import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { api } from '@/lib/api';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', city: '' });

  useEffect(() => {
    api.get('/users/me').then(u => { setUser(u); setForm({ name: u.name, city: u.city || '' }); }).catch(() => {});
  }, []);

  const save = async () => {
    const updated = await api.patch('/users/me', form);
    setUser(updated);
    setEditing(false);
  };

  if (!user) return <View style={styles.center}><Text style={styles.hint}>Log in to view your profile</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name[0]}</Text>
      </View>
      {editing ? (
        <View style={styles.form}>
          <TextInput value={form.name} onChangeText={t => setForm(p => ({ ...p, name: t }))} style={styles.input} placeholder="Name" />
          <TextInput value={form.city} onChangeText={t => setForm(p => ({ ...p, city: t }))} style={styles.input} placeholder="City" />
          <TouchableOpacity style={styles.btn} onPress={save}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => setEditing(false)}><Text style={styles.btnOutlineText}>Cancel</Text></TouchableOpacity>
        </View>
      ) : (
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.sub}>{user.email}</Text>
          <Text style={styles.row}>Skill: {user.skillLevel}</Text>
          <Text style={styles.row}>City: {user.city || '—'}</Text>
          <TouchableOpacity style={styles.btnOutline} onPress={() => setEditing(true)}><Text style={styles.btnOutlineText}>Edit Profile</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { color: '#9ca3af' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#166534' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  sub: { color: '#6b7280', marginBottom: 16 },
  row: { color: '#374151', marginBottom: 6 },
  form: { width: '100%', gap: 10 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#fff' },
  btn: { backgroundColor: '#16a34a', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
  btnOutline: { borderWidth: 1, borderColor: '#16a34a', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnOutlineText: { color: '#16a34a', fontWeight: '600' },
  info: { width: '100%', gap: 4 },
});
