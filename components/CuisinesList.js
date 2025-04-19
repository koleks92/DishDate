import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";

function CuisinesList({
    cuisinesList,
    selectedCuisineHandler,
    selectedCuisine,
    multiselect,
}) {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [selected, setSelected] = useState([]);
    const [allCuisinesView, setAllCuisinesView] = useState(false);

    useEffect(() => {
        if (selectedCuisine) {
            setValue(selectedCuisine);
        }
    }, [selectedCuisine]);

    useEffect(() => {
        if (selected.length > 0) {
            selectedCuisineHandler(
                cuisinesList.filter((cuisine) => selected.includes(cuisine.id))
            );
            setAllCuisinesView(false);
        } else {
            selectedCuisineHandler(999);
            setAllCuisinesView(true);
        }
    }, [selected]);

    if (multiselect) {
        return (
            <View style={styles.root}>
                <View style={styles.shadow}>
                <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    itemTextStyle={styles.itemTextStyle}
                    iconStyle={styles.iconStyle}
                    search
                    data={cuisinesList}
                    labelField="name"
                    valueField="id"
                    placeholder="Select cuisines"
                    searchPlaceholder="Search..."
                    maxSelect={6}
                    value={selected}
                    onChange={(item) => {
                        setSelected(item);
                    }}
                    selectedStyle={styles.selectedStyle}
                />
                {allCuisinesView && <Text>All cuisines</Text>}
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.root}>
                <View style={styles.shadow}>
                    <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        itemTextStyle={styles.itemTextStyle}
                        itemContainerStyle={styles.itemContainerStyle}
                        data={cuisinesList}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        placeholder={!isFocus ? "Select cuisine" : "..."}
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(item) => {
                            selectedCuisineHandler({
                                id: item.id,
                                name: item.name,
                            });
                            setIsFocus(false);
                        }}
                    />
                </View>
            </View>
        );
    }
}

export default CuisinesList;

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
