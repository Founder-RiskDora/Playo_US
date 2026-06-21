import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';

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

export default function DiscoverScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/activities');
      setActivities(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color="#16a34a" size="large" /></View>;

  return (
    <FlatList
      data={activities}
      keyExtractor={a => a.id}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      ListEmptyComponent={<Text style={styles.empty}>No games yet. Host one!</Text>}
      renderItem={({ item }) => {
        const count = item.currentPlayerCount ?? 0;
        const spots = item.maxPlayers - count;
        return (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/activity/${item.id}`)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.badge, spots <= 0 ? styles.badgeFull : styles.badgeOpen]}>
                {spots <= 0 ? 'Full' : `${spots} open`}
              </Text>
            </View>
            <Text style={styles.cardSub}>{item.courtName}</Text>
            <Text style={styles.cardAddr} numberOfLines={1}>{item.address}</Text>
            <Text style={styles.cardDate}>{new Date(item.dateTimeStart).toLocaleString()}</Text>
            {item.host && <Text style={styles.cardHost}>by {item.host.name}</Text>}
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 48 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { flex: 1, fontWeight: '600', fontSize: 15, color: '#111827' },
  badge: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, fontSize: 11, fontWeight: '500' },
  badgeOpen: { backgroundColor: '#dcfce7', color: '#166534' },
  badgeFull: { backgroundColor: '#fee2e2', color: '#991b1b' },
  cardSub: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  cardAddr: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  cardDate: { fontSize: 12, color: '#6b7280' },
  cardHost: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
});
