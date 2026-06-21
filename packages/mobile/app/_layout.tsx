import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#16a34a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="activity/[id]" options={{ title: 'Game Details' }} />
        <Stack.Screen name="activity/new" options={{ title: 'Host a Game' }} />
        <Stack.Screen name="activity/[id]/chat" options={{ title: 'Group Chat' }} />
      </Stack>
    </>
  );
}
