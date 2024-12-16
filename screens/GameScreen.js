import { Text, View, StyleSheet } from "react-native";

function GameScreen() {
    return (
        <View style={styles.root}>
            <Text>GameScreen</Text>
        </View>
    )
}

export default GameScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})