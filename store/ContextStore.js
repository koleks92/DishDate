import { createContext, useState } from "react";
import { supabase } from "../util/supabase";

export const DDContext = createContext();

export const DDProvider = ({ children }) => {
    const [dishes, setDishes] = useState(null);
    const [session, setSession] = useState(null);
    const [cuisinesList, setCuisinesList] = useState(null);

    // Handle SignOut
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error: ", error);
        }
    };

    // Get all dishes for the current user
    const loadUserDishes = async () => {
        const { data, error } = await supabase
            .from("UsersDishes")
            .select("*")
            .eq("user_id", session["user"]["id"]);

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        return data;
    };

    // Get Dishes from the database
    const loadDishesHandler = async () => {
        const { data, error } = await supabase.from("Dishes").select("*");

        if (error) {
            console.log("Error fetching dishes", error);
        }

        if (data) {
            setDishes(data)
        }
    };

    // Get Cuisines from the database
    const loadCuisinesHandler = async () => {
        const { data, error } = await supabase
            .from("Cuisines")
            .select("id, name");

        if (error) {
            console.log("Error fetching cuisines", error);
        }

        if (data) {
            setCuisinesList(data);
        }
    };

    // Get dishes from the database based on the cuisine
    const loadDishesByCuisines = async (cuisinesIds) => {
        const { data, error } = await supabase
            .from("Dishes")
            .select("*")
            .in("cuisine_id", cuisinesIds);

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        return data;
    };

    // Get all dishes for the current user
    const loadUserDishesByCuisines = async (cuisinesIds) => {
        const { data, error } = await supabase
            .from("UsersDishes")
            .select("*")
            .eq("user_id", session["user"]["id"])
            .in("cuisine_id", cuisinesIds);

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        return data;
    };

    // Database check for gameID
    const databaseCheckGameId = async (gameId) => {
        const { data, error } = await supabase
            .from("GameRoom")
            .select("*")
            .eq("game_id", gameId)
            .eq("status", "open");

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        return data && data.length > 0; // Return true if gameId exists, false otherwise
    };

    return (
        <DDContext.Provider
            value={{
                handleSignOut,
                loadDishesHandler,
                dishes,
                session,
                setSession,
                loadUserDishes,
                loadCuisinesHandler,
                cuisinesList,
                loadDishesByCuisines,
                loadUserDishesByCuisines,
                databaseCheckGameId,
            }}
        >
            {children}
        </DDContext.Provider>
    );
};

export default DDProvider;
