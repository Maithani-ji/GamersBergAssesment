// App.tsx
import React from 'react'; // Removed JSX import
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UsernameScreen from './src/screens/UserNameScreen';
import ChatScreen from './src/screens/ChatScreen';


export type RootStackParamList = {
  Username: undefined;
  Chat: { username: string }; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Username">
        <Stack.Screen name="Username" component={UsernameScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}