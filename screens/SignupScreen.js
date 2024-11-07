import { View, Text, StyleSheet } from "react-native";

function SignupScreen() {
    return (
        <View style={styles.root}>
            <Text>Signup</Text>
        </View>
    )
}

export default SignupScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})