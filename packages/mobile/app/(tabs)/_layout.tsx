import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#16a34a',
      headerStyle: { backgroundColor: '#16a34a' },
      headerTintColor: '#fff',
    }}>
      <Tabs.Screen name="index" options={{ title: 'Discover', tabBarLabel: 'Discover' }} />
      <Tabs.Screen name="my-activities" options={{ title: 'My Games', tabBarLabel: 'My Games' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarLabel: 'Profile' }} />
    </Tabs>
  );
}
