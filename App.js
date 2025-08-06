import React, { useEffect, useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
    createStackNavigator,
    CardStyleInterpolators,
} from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import LoginScreen from "./screens/LoginScreen";
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
import DishScreen from "./screens/DishScreen";
import * as SplashScreen from "expo-splash-screen";

import DDProvider from "./store/ContextStore";
import * as Notifications from "expo-notifications";

import { Platform, StatusBar } from "react-native";
import Colors from "./constants/Colors";
import { useFonts, getLoadedFonts } from "expo-font";

import * as Linking from "expo-linking";
import * as Sentry from "@sentry/react-native";

Sentry.init({
    dsn: "https://a76fafe33170682e6654aca54adae56b@o4509752951963648.ingest.de.sentry.io/4509753240715344",

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [
        Sentry.mobileReplayIntegration(),
        Sentry.feedbackIntegration(),
    ],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
});

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

SplashScreen.preventAutoHideAsync();

// SplashScreen configuration
SplashScreen.setOptions({
    duration: 400,
    fade: true,
});

const linking = {
    prefixes: ["dishdate://", "https://dishdate.app"],
    config: {
        screens: {
            StartScreen: "start",
            JoinGameScreen: "join-game/:gameId",
        },
    },
};

function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    const [loaded, error] = useFonts({
        "Tektur-Regular": require("./assets/fonts/Tektur-Regular.ttf"),
        "Tektur-Bold": require("./assets/fonts/Tektur-Bold.ttf"),
    });

    useEffect(() => {
        async function prepare() {
            StatusBar.setBarStyle("dark-content"); // Dark icons on status bar
            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor(Colors.background); // Makes status bar background transparent
            }

            if (loaded) {
                // Fonts are loaded, hide the splash screen
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, [loaded]);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{ flex: 1, backgroundColor: Colors.background }}
            >
                <DDProvider>
                    <NavigationContainer linking={linking}>
                        <Stack.Navigator
                            initialRouteName="LoginScreen" // Set the initial screen here
                            screenOptions={{
                                headerShown: false,
                                cardStyle: {
                                    backgroundColor: Colors.background,
                                },
                                gestureEnabled: true,
                                cardStyleInterpolator:
                                    CardStyleInterpolators.forHorizontalIOS, // <-- This makes Android behave like iOS // transition bg color
                            }}
                        >
                            <Stack.Screen
                                name="LoginScreen"
                                component={LoginScreen}
                            />
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
                                options={{
                                    gestureEnabled: false, // disables swipe back on iOS
                                    headerBackVisible: false, // hides the back arrow in header
                                }}
                            />
                            <Stack.Screen
                                name="GameResultsScreen"
                                component={GameResultScreen}
                            />
                            <Stack.Screen
                                name="GamesListScreen"
                                component={GamesListScreen}
                            />
                            <Stack.Screen
                                name="DishScreen"
                                component={DishScreen}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </DDProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default Sentry.wrap(App);
