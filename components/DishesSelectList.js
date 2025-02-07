import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, View } from "react-native";
import { useState } from "react";

function DishesSelectList({ selectedDishesHandler, disabledIndexes }) {
    let dishes = [
        { title: "Standard Dishes", choice: 0 },
        { title: "My Dishes", choice: 1 },
        { title: "Mix Dishes", choice: 2 },
    ];

    // Filter out disabled indexes
    dishes = dishes.filter((dish, index) => !disabledIndexes.includes(index));

    const [value, setValue] = useState(null);

    return (
        <View style={styles.container}>
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
                    selectedDishesHandler(item.choice);
                }}
                visibleSelectedItem={false}
            />
        </View>
    );
}

export default DishesSelectList;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 16,
        width: "60%",
    },
    dropdown: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: "absolute",
        backgroundColor: "white",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    item: {
        padding: 17,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    selectedStyle: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 14,
        backgroundColor: "white",
        shadowColor: "#000",
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
    },
});
