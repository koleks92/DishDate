import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../services/firebaseConfig";

function LoginScreen() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    // Function to handle sign-in
    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Logged in successfully!");
        } catch (error) {
            console.error("Error logging in:", error);
            Alert.alert("Login Failed", error.message);
        }
    };

    // Function to handle sign-up (optional)
    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account created successfully!");
        } catch (error) {
            console.error("Error signing up:", error);
            Alert.alert("Sign Up Failed", error.message);
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
