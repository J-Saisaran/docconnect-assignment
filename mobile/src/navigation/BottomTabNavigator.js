import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { HomeIcon, DiscoverIcon, SendIcon } from '../components/SvgIcons';

const Tab = createBottomTabNavigator();

// Placeholder screen for Chat tab (as per instructions: "No chat and no sharing posts into chats")
const ChatPlaceholderScreen = () => {
  return <View style={styles.chatPlaceholder} />;
};

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              size={28}
              color={focused ? COLORS.primaryDark : '#8E8E93'}
              filled={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <DiscoverIcon
              size={28}
              color={focused ? COLORS.primaryDark : '#8E8E93'}
              filled={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatPlaceholderScreen}
        listeners={{
          tabPress: (e) => {
            // Prevent default navigation
            e.preventDefault();
            Alert.alert(
              'DocConnect Chat',
              'Chat is intentionally omitted as per the assignment brief ("No chat and no sharing posts into chats"). Architecture walkthrough for Chat is documented in the README.',
              [{ text: 'Understood' }]
            );
          },
        }}
        options={{
          tabBarIcon: ({ focused }) => (
            <SendIcon
              size={26}
              color="#8E8E93"
              filled={false}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 68,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  chatPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
});
