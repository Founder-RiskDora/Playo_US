import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SectionList } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';

export default function MyActivitiesScreen() {
  const router = useRouter();
  const [data, setData] = useState<{ hosted: any[]; joined: any[] }>({ hosted: [], joined: [] });

  useEffect(() => {
    api.get('/activities/my').then(setData).catch(() => {});
  }, []);

  const sections = [
    { title: 'Hosting', data: data.hosted },
    { title: 'Joined', data: data.joined },
  ].filter(s => s.data.length > 0);

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No activities yet</Text>}
      renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/activity/${item.id}`)}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSub}>{new Date(item.dateTimeStart).toLocaleString()}</Text>
          <Text style={styles.cardSub}>{item.courtName}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 8 },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 48 },
  sectionHeader: { fontWeight: '700', fontSize: 14, color: '#374151', marginTop: 12, marginBottom: 4 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1, marginBottom: 8 },
  cardTitle: { fontWeight: '600', fontSize: 14, color: '#111827', marginBottom: 4 },
  cardSub: { fontSize: 12, color: '#6b7280' },
});
