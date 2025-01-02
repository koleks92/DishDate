import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import StartScreen from "./screens/StartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DishesScreen from "./screens/DishesScreen";
import StartGameScreen from "./screens/StartGameScreen";
import EditDishesScreen from "./screens/EditDishesScreen";
import DDProvider from "./store/ContextStore";

const Stack = createStackNavigator();

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
                            name="StartGameScreen"
                            component={StartGameScreen}
                        />
                        <Stack.Screen
                            name="DishesScreen"
                            component={DishesScreen}
                        />
                        <Stack.Screen
                            name="EditDishesScreen"
                            component={EditDishesScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </DDProvider>
        </SafeAreaProvider>
    );
}

export default App;
