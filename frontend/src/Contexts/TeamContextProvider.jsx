import { useState } from "react";
import TeamContext from "./teamContext";

const TeamContextProvider = ({children}) => {
    const [team,setTeam] = useState(null);

    return(
        <TeamContext.Provider value={{team,setTeam}}>
        {children}
        </TeamContext.Provider>
    )
}

export default TeamContextProvider;