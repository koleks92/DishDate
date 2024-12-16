import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import StartScreen from "./screens/StartScreen";
import DDProvider from "./store/ContextStore";

const Stack = createStackNavigator();

function App() {

    return (
        <SafeAreaProvider>
            <DDProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                            name="StartScreen"
                            component={StartScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </DDProvider>
        </SafeAreaProvider>
    );
}

export default App;
