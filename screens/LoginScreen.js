import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { auth } from "../services/firebaseConfig";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
} from "@firebase/auth";

function LoginScreen() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    // Function to handle sign-in
    const handleLogin = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            Alert.alert("Success", "Logged in successfully!");
        } catch (error) {
            console.error("Error logging in:", error);
            Alert.alert("Login Failed", error.message);
        }
    };

    // Function to handle sign-up and login if sucressful
    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            Alert.alert(
                "Success",
                "Account created and logged in successfully!"
            );
        } catch (error) {
            console.error("Error signing up:", error);
            Alert.alert("Sign Up Failed", error.message);
        }
    };

    // Function to hadle anonymous login
    const handleAnonymousLogin = async () => {
        try {
            const user = await signInAnonymously(auth);
            Alert.alert("Success", "Logged in Anonymously!");
        } catch (error) {
            Alert.alert("Error logging in anonymously", error.message);
        }
    };

    return (
        <View style={styles.root}>
            <Text>Login</Text>
            <TextInput
                placeholder="email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                placeholder="password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button
                title="I don't wanna create an account"
                onPress={handleAnonymousLogin}
            />
        </View>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
