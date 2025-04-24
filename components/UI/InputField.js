import { View, StyleSheet, TextInput } from "react-native";
import Colors from "../../constants/Colors";
import Sizes from "../../constants/Sizes";

function InputField({ placeholder, value, onChangeText, secureTextEntry, keyboardType, maxLength }) {
    return (
        <View style={styles.root}>
            <View style={styles.shadow}>
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    style={[styles.textInput, keyboardType === "numeric" && { fontSize: Sizes.inputTextSize * 1.6 }]}
                    autoCapitalize="none"
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                />
            </View>
        </View>
    );
}

export default InputField;

const styles = StyleSheet.create({
    root: {
        width: Sizes.buttonWidth,
        height: Sizes.buttonHeight,
        marginBottom: Sizes.buttonMarginBottom,
    },
    shadow: {
        flex: 1,
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    textInput: {
        flex: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderWidth: 3,
        padding: Sizes.buttonInsidePadding,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.inputTextSize,
        textAlign: "center",
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
    },
});
