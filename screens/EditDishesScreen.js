import { Text, View, StyleSheet, TextInput, Button } from "react-native";

import { useState } from "react";

function EditDishesScreen({ route }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Get edit form the route
    const { edit } = route.params || {};

    // Save dish
    const saveDish = () => {
        console.log("Save TODO")
    }

    if (edit) {
        return (
            <View style={styles.root}>
                <Text>Edit Dish</Text>
                <Text>TODO</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.root}>
                <Text>New Dish</Text>
                <TextInput value={name} onChangeText={setName} placeholder="Enter name" />
                <TextInput value={description} onChangeText={setDescription} placeholder="Enter description" />
                <Button title="Save" onPress={() => { saveDish }} />

            </View>
        );
    }
}

export default EditDishesScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})