import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import StartScreen from "./screens/StartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DishesScreen from "./screens/DishesScreen";
import NewGameScreen from "./screens/NewGameScreen";
import EditDishesScreen from "./screens/EditDishesScreen";
import DishesListScreen from "./screens/DishesListScreen";
import GameScreen from "./screens/GameScreen";
import JoinGameScreen from "./screens/JoinGameScreen";
import DDProvider from "./store/ContextStore";
import * as Notifications from 'expo-notifications';

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  

function App() {
    return (
        <SafeAreaProvider>
            <DDProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="StartScreen" // Set the initial screen here
                        screenOptions={{ headerShown: false }}
                    >
                        <Stack.Screen
                            name="StartScreen"
                            component={StartScreen}
                        />
                        <Stack.Screen
                            name="ProfileScreen"
                            component={ProfileScreen}
                        />
                        <Stack.Screen
                            name="NewGameScreen"
                            component={NewGameScreen}
                        />
                        <Stack.Screen
                            name="JoinGameScreen"
                            component={JoinGameScreen}
                        />
                        <Stack.Screen
                            name="DishesScreen"
                            component={DishesScreen}
                        />
                        <Stack.Screen
                            name="EditDishesScreen"
                            component={EditDishesScreen}
                        />
                        <Stack.Screen
                            name="DishesListScreen"
                            component={DishesListScreen}
                        />
                        <Stack.Screen
                            name="GameScreen"
                            component={GameScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </DDProvider>
        </SafeAreaProvider>
    );
}

export default App;
