import {
    View,
    Text,
    StyleSheet,
    Button,
    Animated,
    PanResponder,
} from "react-native";
import DishView from "./DishView";
import { useState, useRef, useEffect } from "react";
import Sizes from "../../constants/Sizes";
import Colors from "../../constants/Colors";

function DishSelector({ dishes, dishesResultHandler }) {
    const [results, setResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const currentIndexRef = useRef(currentIndex);

    useEffect(() => {
        if (results.length == dishes.length) {
            // All dishes have been answered
            // Handle the results here
            dishesResultHandler(results);
        }
    }, [results]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    const rotate = pan.x.interpolate({
        inputRange: [-Sizes.scrW / 2, 0, Sizes.scrW / 2],
        outputRange: ["-15deg", "0deg", "15deg"],
        extrapolate: "clamp",
    });

    // Color interpolation based on horizontal movement
    const backgroundColor = pan.x.interpolate({
        inputRange: [-Sizes.scrW / 2, 0, Sizes.scrW / 2],
        outputRange: [Colors.red, Colors.backgroundButton, Colors.green],
        extrapolate: "clamp",
    });

    const minX = -Sizes.scrW / 2;
    const maxX = Sizes.scrW / 2;

    // Create the pan responder
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                // Set the current offset value
                pan.setOffset({
                    x: pan.x._value, // Save the current pan.x value as offset
                    y: pan.y._value, // Save the current pan.y value as offset
                });

                // Reset relative movement to 0
                pan.x.setValue(0); // Reset x value to 0
                pan.y.setValue(0); // Reset y value to 0
            },

            onPanResponderMove: (e, gestureState) => {
                let newX = gestureState.dx + pan.x._offset;

                if (newX >= minX && newX <= maxX) {
                    pan.setValue({ x: gestureState.dx, y: 0 });
                }

                if (newX >= Sizes.scrW / 10) {
                    Animated.timing(pan, {
                        toValue: { x: Sizes.scrW, y: 0 },
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        if (pan.x._value == Sizes.scrW) {
                            handleYes();
                            Animated.timing(pan, {
                                toValue: { x: 0, y: 0 },
                                duration: 200,
                                useNativeDriver: false,
                            }).start();
                        }
                    });
                }

                if (newX <= -Sizes.scrW / 10) {
                    Animated.timing(pan, {
                        toValue: { x: -Sizes.scrW, y: 0 },
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        if (pan.x._value == -Sizes.scrW) {
                            handleNo();
                            Animated.timing(pan, {
                                toValue: { x: 0, y: 0 },
                                duration: 200,
                                useNativeDriver: false,
                            }).start();
                        }
                    });
                }
            },

            onPanResponderRelease: (e, gestureState) => {
                let newX = gestureState.dx + pan.x._offset;

                if (newX < Sizes.scrW / 10 && newX > -Sizes.scrW / 10) {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
                // Reset the offset
                pan.flattenOffset();
            },
        })
    ).current;

    const handleYes = () => {
        setResults((prevResults) => [
            ...prevResults,
            { dish: dishes[currentIndexRef.current], answer: true },
        ]);

        if (currentIndexRef.current < dishes.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleNo = () => {
        setResults((prevResults) => [
            ...prevResults,
            { dish: dishes[currentIndexRef.current], answer: false },
        ]);

        if (currentIndexRef.current < dishes.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };
    
    const currentDish = dishes[currentIndex] || null;

    return (
        <Animated.View style={[styles.root]}>
            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    pan.getLayout(),
                    styles.dishContainer,
                    {
                        transform: [{ rotate }],
                    },
                ]}
            >
                {currentDish && (
                    <DishView
                        dish={currentDish}
                        backgroundColor={backgroundColor}
                    />
                )}
            </Animated.View>
        </Animated.View>
    );
}

export default DishSelector;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dishContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    buttonsContainer: {
        display: "flex",
        flexDirection: "row",
    },
});
