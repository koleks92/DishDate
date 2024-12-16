import { createContext, useState } from "react";
import auth from "@react-native-firebase/auth";

export const DDContext = createContext();

export const DDProvider = ({ children }) => {
    const [user, setUser] = useState(user);

    // Handle SignOut
    const handleSignOut = () => {
        auth()
            .signOut()
            .then(() => console.log("User signed out!"));
        setUser(null)
    };

    return (
        <DDContext.Provider value={{ user, setUser, handleSignOut }}>
            {children}
        </DDContext.Provider>
    );
};

export default DDProvider;
