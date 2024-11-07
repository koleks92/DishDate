import { View, Text, StyleSheet } from "react-native";

function StartScreen() {
    return (
        <View style={styles.root}>
            <Text>Start</Text>
        </View>
    )
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