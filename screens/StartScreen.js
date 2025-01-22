import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { DDContext } from "../store/ContextStore";
import { supabase } from "../util/supabase";

function StartScreen({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    // Context Store
    const { handleSignOut, loadDishesHandler, session, setSession } = useContext(DDContext);

    // Configure Google Cloud SignIn
    GoogleSignin.configure({
        webClientId:
            "602018707783-ddo4gqideosf5ajktskbpgea6su94tlp.apps.googleusercontent.com",
    });

    // Get dishes from database ( TODO )
    useEffect(() => {
        loadDishesHandler();
    }, []);

    // Handle session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    // Handle Google Sign In
    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data.idToken) {
                console.log(userInfo.data.idToken)
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: "google",
                    token: userInfo.data.idToken,
                });
                if (error) {
                    console.error("Supabase sign-in error:", error);
                } else {
                    console.log("Supabase login data:", data);
                }
            } else {
                throw new Error("No ID token present in Google response!");
            }
        } catch (error) {
            console.error("Google Sign-In error:", error);
        }
    };

    // Handle anonymous SignIn
    const handleAnonymousSignIn = async () => {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signInAnonymously();

        setLoading(false);
    };

    // Handle SignUp
    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields");
            return;
        } else {
            setLoading(true);
            const {
                data: { session },
                error,
            } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) Alert.alert(error.message);
            if (!session)
                Alert.alert("Please check your inbox for email verification!");
            setLoading(false);
        }
    };

    // Handle SignIn
    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields");
            return;
        } else {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) Alert.alert(error.message);
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <View style={styles.root}>
                <View style={styles.emailContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Password Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button
                        onPress={handleSignUp}
                        title="Sign Up"
                        disabled={loading}
                    />
                    <Button
                        onPress={handleSignIn}
                        title="Sign In"
                        disabled={loading}
                    />
                </View>
                <View style={styles.socialContainer}>
                    <Button
                        onPress={handleAnonymousSignIn}
                        disabled={loading}
                        title="Anonymous SignIn"
                    />
                    <Button onPress={handleGoogleSignIn} title="Google" />
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.root}>
                <Button
                    title="Start Game"
                    onPress={() => {
                        navigation.navigate("StartGameScreen");
                    }}
                />
                <Button title="SignOut" onPress={handleSignOut} />
                {!session.user.is_anonymous && (
                    <>
                        <Button
                            title="Profile"
                            onPress={() => {
                                navigation.navigate("ProfileScreen");
                            }}
                        />
                        <Button
                            title="Dishes"
                            onPress={() => {
                                navigation.navigate("DishesScreen");
                            }}
                        />
                    </>
                )}
            </View>
        );
    }
}

export default StartScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
