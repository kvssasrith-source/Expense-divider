import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './src/context/AppContext';

import HomeScreen from './src/screens/HomeScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import SettleUpScreen from './src/screens/SettleUpScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const themeColor = '#FF0055'; // Neon Pink
const bgDark = '#090909';
const cardDark = '#141414';
const inactiveColor = '#666666';

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Friends') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Settle Up') iconName = focused ? 'flash' : 'flash-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00FFCC', // Neon Cyan
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: cardDark,
          borderTopWidth: 1,
          borderTopColor: '#333',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        headerStyle: { backgroundColor: bgDark, shadowOpacity: 0, elevation: 0, borderBottomWidth: 0 },
        headerTitleStyle: { fontWeight: '900', fontSize: 28, color: '#FFF', textTransform: 'uppercase', letterSpacing: 1 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{headerTitle: 'DASHBOARD'}} />
      <Tab.Screen name="Friends" component={FriendsScreen} options={{headerTitle: 'THE CREW'}} />
      <Tab.Screen name="Settle Up" component={SettleUpScreen} options={{headerTitle: 'SETTLE UP'}} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bgDark } }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen 
            name="AddExpense" 
            component={AddExpenseScreen} 
            options={{ 
              presentation: 'modal', 
              headerShown: true, 
              title: 'NEW EXPENSE', 
              headerStyle: { backgroundColor: '#FF0055' }, 
              headerTintColor: '#000', 
              headerTitleStyle: { fontWeight: '900', fontSize: 24, letterSpacing: 2 } 
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </AppProvider>
  );
}
