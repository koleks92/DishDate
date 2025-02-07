import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
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

    useEffect(() => {
        if (selectedCuisine) {
            setValue(selectedCuisine);
        }
    }, [selectedCuisine]);

    useEffect(() => {
        if (selected.length > 0) {
            selectedCuisineHandler(cuisinesList.filter((cuisine) => selected.includes(cuisine.id)));
        }
    }, [selected])


    if (multiselect) {
        return (
            <View style={styles.container}>
                <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
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
                        console.log(item);
                        setSelected(item);
                    }}
                    selectedStyle={styles.selectedStyle}
                />
            </View>
        );
    } else {
        return (
          <View style={styles.container}>
          <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              search
              data={cuisinesList}
              labelField="name"
              valueField="id"
              placeholder="Select cuisines"
              searchPlaceholder="Search..."
              maxSelect={6}
              value={selected} // Pass only the IDs to the MultiSelect
              onChange={(item) => {              
                  setSelected(item); // Update the state with the full items
              }}
              selectedStyle={styles.selectedStyle}
          />
      </View>
        );
    }
}

export default CuisinesList;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 16,
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
