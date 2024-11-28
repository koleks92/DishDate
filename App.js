import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";


import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import StartScreen from "./screens/StartScreen";

const Stack = createStackNavigator();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Simulate an authentication check (in reality, this would involve checking secure storage or an auth API)
    useEffect(() => {
        const checkAuth = async () => {
            // Logic to check if user is logged in
            // Example: setIsLoggedIn(true) if token exists
        };
        checkAuth();
    }, []);

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                {isLoggedIn ? (
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        {/* Main App Stack */}
                        <Stack.Screen name="Start" component={StartScreen} />
                    </Stack.Navigator>
                ) : (
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        {/* Auth Stack */}
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </Stack.Navigator>
                )}
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default App;
