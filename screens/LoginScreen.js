import { View, Text, StyleSheet } from "react-native";

function LoginScreen() {
    return (
        <View style={styles.root}>
            <Text>Login</Text>
        </View>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})