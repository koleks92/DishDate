import { StyleSheet, View, PanResponder, Animated, Text } from "react-native";
import Sizes from "../../constants/Sizes";
import Colors from "../../constants/Colors";
import { useRef, useState } from "react";

function CustomSlider({ min = 5, max = 25, sliderValueHandler }) {
    const translateX = useRef(
        new Animated.Value(Sizes.sliderWidth / 2 - Sizes.tickWidth / 2)
    ).current;
    const sliderLayout = useRef({
        width: Sizes.sliderWidth,
    }).current;
    const [value, setValue] = useState(15);

    const handleSliderValue = (newValue) => {
        setValue(newValue);
        sliderValueHandler(newValue);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                translateX.setOffset(translateX._value);
                translateX.setValue(0);
            },

            onPanResponderMove: (_, gestureState) => {
                let newX = gestureState.dx + translateX._offset;
                const maxX = sliderLayout.width - Sizes.tickWidth;

                // Clamp movement within rail
                if (newX < 0) newX = 0;
                if (newX > maxX) newX = maxX;

                const percent = newX / maxX;
                const newValue = Math.round(min + percent * (max - min));
                handleSliderValue(newValue);

                translateX.setValue(newX - translateX._offset);
            },

            onPanResponderRelease: () => {
                translateX.flattenOffset(); // merge offset
            },
        })
    ).current;

    return (
        <View style={styles.root}>
            <View style={styles.slider}>
                <View style={styles.rail} />
                <Animated.View
                    style={[
                        styles.labelContainer,
                        {
                            transform: [{ translateX }],
                        },
                    ]}
                >
                    <Text style={styles.labelText}>{value} dishes</Text>
                </Animated.View>
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.tick,
                        {
                            transform: [{ translateX }],
                        },
                    ]}
                ></Animated.View>
            </View>
        </View>
    );
}

export default CustomSlider;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Sizes.buttonMarginBottom,
        height: Sizes.tickHeight,
    },
    slider: {
        width: Sizes.sliderWidth,
        height: Sizes.sliderHeight,
        justifyContent: "center",
    },
    rail: {
        width: "100%",
        height: Sizes.railHeight,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderWidth: 3,
    },
    tick: {
        height: Sizes.tickHeight,
        width: Sizes.tickWidth,
        backgroundColor: Colors.backgroundButton,
        borderColor: Colors.black,
        borderWidth: 3,
        position: "absolute",
    },
    labelContainer: {
        position: "absolute",
        width: Sizes.tickWidth * 4,
        left: -Sizes.tickWidth * 1.5,
        bottom: Sizes.tickHeight,
        alignItems: "center",
        justifyContent: "center",
    },
    labelText: {
        fontSize: Sizes.tickTextSize,
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.black,
        fontFamily: "Tektur-Bold",
    },
});
