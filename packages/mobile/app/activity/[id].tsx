import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '@/lib/api';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    api.get(`/activities/${id}`).then(setActivity).finally(() => setLoading(false));
  }, [id]);

  const requestToJoin = async () => {
    setRequesting(true);
    try {
      await api.post(`/activities/${id}/join-requests`, {});
      Alert.alert('Request Sent', 'The host will review your request.');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (!activity) return <View style={styles.center}><Text>Not found</Text></View>;

  const spots = activity.maxPlayers - (activity.currentPlayerCount || 0);
  const isFull = spots <= 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{activity.title}</Text>
          <Text style={[styles.badge, isFull ? styles.badgeFull : styles.badgeOpen]}>
            {isFull ? 'Full' : `${spots} spots left`}
          </Text>
        </View>
        <Text style={styles.hostLabel}>by {activity.host?.name}</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.infoRow}><Text style={styles.label}>Venue: </Text>{activity.courtName}</Text>
          <Text style={styles.infoRow}><Text style={styles.label}>Address: </Text>{activity.address}</Text>
          <Text style={styles.infoRow}><Text style={styles.label}>Start: </Text>{new Date(activity.dateTimeStart).toLocaleString()}</Text>
          <Text style={styles.infoRow}><Text style={styles.label}>End: </Text>{new Date(activity.dateTimeEnd).toLocaleString()}</Text>
          <Text style={styles.infoRow}><Text style={styles.label}>Players: </Text>{activity.currentPlayerCount || 0} / {activity.maxPlayers}</Text>
        </View>

        {activity.description ? (
          <View style={styles.descBlock}>
            <Text style={styles.sectionTitle}>About this game</Text>
            <Text style={styles.desc}>{activity.description}</Text>
          </View>
        ) : null}

        {!isFull && (
          <TouchableOpacity style={styles.btn} onPress={requestToJoin} disabled={requesting}>
            <Text style={styles.btnText}>{requesting ? 'Sending...' : 'Request to Join'}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.chatBtn} onPress={() => router.push(`/activity/${id}/chat`)}>
          <Text style={styles.chatBtnText}>Open Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Roster ({activity.currentPlayerCount || 0})</Text>
        {(activity.participants || []).map((p: any) => (
          <View key={p.id} style={styles.playerRow}>
            <View style={styles.playerAvatar}>
              <Text style={styles.playerAvatarText}>{p.user.name[0]}</Text>
            </View>
            <View>
              <Text style={styles.playerName}>{p.user.name} {p.role === 'Host' ? '(Host)' : ''}</Text>
              <Text style={styles.playerSkill}>{p.user.skillLevel}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  title: { flex: 1, fontSize: 20, fontWeight: 'bold', color: '#111827' },
  badge: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, fontSize: 11, fontWeight: '600' },
  badgeOpen: { backgroundColor: '#dcfce7', color: '#166534' },
  badgeFull: { backgroundColor: '#fee2e2', color: '#991b1b' },
  hostLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 12 },
  infoBlock: { marginBottom: 12 },
  infoRow: { fontSize: 13, color: '#374151', marginBottom: 4 },
  label: { fontWeight: '600' },
  descBlock: { marginBottom: 12 },
  sectionTitle: { fontWeight: '700', fontSize: 14, color: '#111827', marginBottom: 8 },
  desc: { fontSize: 13, color: '#6b7280', lineHeight: 20 },
  btn: { backgroundColor: '#16a34a', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  chatBtn: { borderWidth: 1, borderColor: '#16a34a', padding: 12, borderRadius: 10, alignItems: 'center' },
  chatBtnText: { color: '#16a34a', fontWeight: '600' },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  playerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center' },
  playerAvatarText: { fontWeight: '700', color: '#166534' },
  playerName: { fontWeight: '500', fontSize: 13, color: '#111827' },
  playerSkill: { fontSize: 11, color: '#9ca3af' },
});
