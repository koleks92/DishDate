import { createContext, useState } from "react";
import { supabase } from "../util/supabase";

export const DDContext = createContext();

export const DDProvider = ({ children }) => {
    const [dishes, setDishes] = useState(null);

    // Handle SignOut
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error: ", error);
        }
    };

    // Get Dishes from the database
    const loadDishesHandler = async () => {
        const { data, error } = await supabase.from("Dishes").select("*");

        if (error) {
            console.log("Error fetching dishes", error);
        }

        fetchedDishes = [];

        data.forEach((dish) => {
            fetchedDishes.push(dish);
        });

        setDishes(fetchedDishes);
    };
    
    return (
        <DDContext.Provider
            value={{
                handleSignOut,
                loadDishesHandler,
                dishes,
            }}
        >
            {children}
        </DDContext.Provider>
    );
};

export default DDProvider;
