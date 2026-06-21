import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';

export default function NewActivityScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    courtName: '',
    address: '',
    dateTimeStart: '',
    dateTimeEnd: '',
    maxPlayers: '10',
  });
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (val: string) => setForm(p => ({ ...p, [key]: val }));

  const submit = async () => {
    if (!form.title || !form.courtName || !form.dateTimeStart || !form.dateTimeEnd) {
      Alert.alert('Missing fields', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const activity = await api.post('/activities', { ...form, maxPlayers: parseInt(form.maxPlayers) });
      router.replace(`/activity/${activity.id}`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        {[
          { label: 'Title *', key: 'title', placeholder: 'Sunday Doubles at Smash Center' },
          { label: 'Court Name *', key: 'courtName', placeholder: 'Smash Center Court 2' },
          { label: 'Address *', key: 'address', placeholder: '123 Main St, San Francisco, CA' },
          { label: 'Start (ISO) *', key: 'dateTimeStart', placeholder: '2025-06-22T09:00:00' },
          { label: 'End (ISO) *', key: 'dateTimeEnd', placeholder: '2025-06-22T11:00:00' },
          { label: 'Max Players *', key: 'maxPlayers', placeholder: '10' },
        ].map(f => (
          <View key={f.key}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              value={(form as any)[f.key]}
              onChangeText={set(f.key)}
              placeholder={f.placeholder}
              keyboardType={f.key === 'maxPlayers' ? 'numeric' : 'default'}
              style={styles.input}
            />
          </View>
        ))}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={form.description}
          onChangeText={set('description')}
          multiline
          numberOfLines={4}
          placeholder="Skill level expected, format, cost info..."
          style={[styles.input, styles.textArea]}
        />
        <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Creating...' : 'Create Game'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  form: { padding: 16, gap: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#fff' },
  textArea: { height: 100, textAlignVertical: 'top' },
  btn: { backgroundColor: '#16a34a', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
