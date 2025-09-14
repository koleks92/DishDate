import { Animated, View, StyleSheet, TextInput } from "react-native";
import Colors from "../../constants/Colors";
import Sizes from "../../constants/Sizes";
import { useRef, useState, useEffect } from "react";

function InputField({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    maxLength,
    strech,
    long,
}) {
    const [isFocused, setIsFocused] = useState(false);
    const heightAnim = useRef(new Animated.Value(Sizes.buttonHeight)).current; // Initial height

    useEffect(() => {
        Animated.timing(heightAnim, {
            toValue: isFocused ? Sizes.buttonHeight * 3 : Sizes.buttonHeight, // Expand to 80 when focused
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [isFocused]);

    return (
        <Animated.View
            style={[
                styles.root,
                strech && { height: heightAnim },
                long && { height: Sizes.buttonHeight * 4 }
            ]}
        >
            <View style={styles.shadow}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={Colors.black}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secureTextEntry}
                    style={[
                        styles.textInput,
                        keyboardType === "numeric" && {
                            fontSize: Sizes.inputTextSize * 1.7,
                            padding: 0,
                        },
                        strech && {
                            textAlign: "justify", // Align text to the left when stretched
                        },
                        long && { textAlign: "justify" },
                    ]}
                    multiline={!!strech}
                    autoCapitalize="none"
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                />
            </View>
        </Animated.View>
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
        padding: Sizes.inputInsidePadding,
        fontFamily: "Tektur-Bold",
        textAlign: "center", // Default alignment for non-stretched
        color: Colors.black,
        fontSize: Sizes.inputTextSize,
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
    },
});
