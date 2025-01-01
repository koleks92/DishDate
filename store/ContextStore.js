import { createContext, useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';


export const DDContext = createContext();

export const DDProvider = ({ children }) => {
    const [user, setUser] = useState(user);
    const [dishes, setDishes] = useState(null);

    // Handle SignOut
    const handleSignOut = () => {
        auth()
            .signOut()
            .then(() => console.log("User signed out!"));
        setUser(null)
    };

    // Get Dishes from the database
    const loadDishesHandler = async () => {
        try {
            console.log("Loading dishes from Firestore...");
            const dishesCollection = await firestore().collection('Dishes').get();
    
            // Process the dishes
            const dishes = dishesCollection.docs.map(doc => ({
                id: doc.id,  // Document ID
                ...doc.data() // Document data
            }));
    
            console.log("Dishes:", dishes);
        } catch (error) {
            console.error("Error loading dishes from Firestore:", error);
        }
    }
    return (
        <DDContext.Provider value={{ user, setUser, handleSignOut, loadDishesHandler, dishes }}>
            {children}
        </DDContext.Provider>
    );
};

export default DDProvider;
