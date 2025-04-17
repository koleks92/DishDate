import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";

function DishesSelectList({ selectedDishesHandler, disabledIndexes }) {
    let dishes = [
        { title: "Standard Dishes", choice: 0 },
        { title: "My Dishes", choice: 1 },
        { title: "Mix Dishes", choice: 2 },
    ];

    // Filter out disabled indexes
    dishes = dishes.filter((dish, index) => !disabledIndexes.includes(index));

    const [value, setValue] = useState(0);

    useEffect(() => {
            selectedDishesHandler(value);
        }, [value]);

    return (
        <View style={styles.root}>
            <View style={styles.shadow}>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={dishes}
                maxHeight={300}
                labelField="title"
                valueField="choice"
                placeholder="Select dishes"
                value={value}
                onChange={(item) => {
                    setValue(item.choice);
                }}
                visibleSelectedItem={false}
            />
            </View> 
        </View>
    );
}

export default DishesSelectList;

const styles = StyleSheet.create({
    root: {
        width: Sizes.buttonWidth,
        height: Sizes.buttonHeight,
        marginBottom: Sizes.buttonMarginBottom,
    },
    shadow: {
        flex: 1,
        padding: 1,
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    dropdown: {
        flex: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderWidth: 3,
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
    },
    placeholderStyle: {
        padding: Sizes.buttonInsidePadding,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.inputTextSize,
        textAlign: "center",
    },
    selectedTextStyle: {
        padding: Sizes.buttonInsidePadding,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.inputTextSize,
        textAlign: "center",
    },
    iconStyle: {
        display: "none",
    },
    inputSearchStyle: {
        padding: Sizes.buttonInsidePadding,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.inputTextSize,
        textAlign: "center",
    },
    itemTextStyle: {
        padding: Sizes.buttonInsidePadding,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.inputTextSize,
        textAlign: "center",
    }
});

