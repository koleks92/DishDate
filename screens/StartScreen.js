import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { DDContext } from "../store/ContextStore";


function StartScreen({navigation}) {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    // Context Store
    const { user, setUser, handleSignOut, loadDishesHandler } = useContext(DDContext);


    // Configure Google Cloud SignIn
    GoogleSignin.configure({
        webClientId:
            "602018707783-ddo4gqideosf5ajktskbpgea6su94tlp.apps.googleusercontent.com",
    });

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        loadDishesHandler();
        if (initializing) setInitializing(false);
    }

    // Handle Google Sign In
    const handleGoogleSignIn = async () => {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
        });
        // Get the users ID token
        const signInResult = await GoogleSignin.signIn();

        // Try the new style of google-sign in result, from v13+ of that module
        idToken = signInResult.data.idToken;
        if (!idToken) {
            // if you are using older versions of google-signin, try old style result
            idToken = signInResult.idToken;
        }
        if (!idToken) {
            throw new Error("No ID token found");
        }

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
    };

    // Handle anonymous SignIn
    const handleAnonymousSignIn = () => {
        auth()
            .signInAnonymously()
            .then(() => {
                console.log("User signed in anonymously");
            })
            .catch((error) => {
                if (error.code === "auth/operation-not-allowed") {
                    console.log("Enable anonymous in your firebase console.");
                }

                console.error(error);
            });
    };

    // Handle SignUp
    const handleSignUp = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields");
            return;
        } else {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    console.log("User account created & signed in!");
                })
                .catch((error) => {
                    if (error.code === "auth/email-already-in-use") {
                        console.log("That email address is already in use!");
                    }

                    if (error.code === "auth/invalid-email") {
                        console.log("That email address is invalid!");
                    }

                    console.error(error);
                });
        }
    };

    // Handle SignIn
    const handleSignIn = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields");
            return;
        } else {
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    console.log("User signed in!");
                })
                .catch((error) => {
                    if (error.code === "auth/email-already-in-use") {
                        console.log("That email address is already in use!");
                    }

                    if (error.code === "auth/invalid-email") {
                        console.log("That email address is invalid!");
                    }

                    Alert.alert("Error", "Invaild email or password");
                });
        }
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    if (!user) {
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

                    <Button onPress={handleSignUp} title="Sign Up" />
                    <Button onPress={handleSignIn} title="Sign In" />
                </View>
                <View style={styles.socialContainer}>
                    <Button
                        onPress={handleAnonymousSignIn}
                        title="Anonymous SignIn"
                    />
                    <Button onPress={handleGoogleSignIn} title="Google" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <Button title="Start Game" onPress={() => { navigation.navigate('StartGameScreen') }} />
            <Button title="SignOut" onPress={handleSignOut} />
            {!user.isAnonymous && (
                <>
                    <Button title="Profile" onPress={() => { navigation.navigate('ProfileScreen') }} />
                    <Button title="Dishes" onPress={() => { navigation.navigate('DishesScreen') }} />
                </>
            )}
        </View>
    );
}

export default StartScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})