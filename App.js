import React, { useEffect } from "react";
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
import GameResultScreen from "./screens/GameResultsScreen";
import GamesListScreen from "./screens/GamesListScreen";

import DDProvider from "./store/ContextStore";
import * as Notifications from "expo-notifications";

import { SafeAreaView, StatusBar } from "react-native";
import Colors from "./constants/Colors";
import { useFonts, getLoadedFonts } from "expo-font";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

function App() {
    const [loaded, error] = useFonts({
        "Tektur-Regular": require("./assets/fonts/Tektur-Regular.ttf"),
        "Tektur-Bold": require("./assets/fonts/Tektur-Bold.ttf"),
    });

    useEffect(() => {
        StatusBar.setBarStyle("dark-content"); // Dark icons on status bar
        StatusBar.setBackgroundColor(Colors.background); // Makes status bar background transparent
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{ flex: 1, backgroundColor: Colors.background }}
            >
                <DDProvider>
                    <NavigationContainer>
                        <Stack.Navigator
                            initialRouteName="StartScreen" // Set the initial screen here
                            screenOptions={{
                                headerShown: false,
                                cardStyle: { backgroundColor: Colors.background }, // transition bg color
                            }}
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
                            <Stack.Screen
                                name="GameResultsScreen"
                                component={GameResultScreen}
                            />
                            <Stack.Screen
                                name="GamesListScreen"
                                component={GamesListScreen}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </DDProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default App;
