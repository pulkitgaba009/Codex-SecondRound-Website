import TimeContext from "./timeContext";
import { useState } from "react";

function TimeContextProvider({children}) {
    const[timeData,setTimeData] = useState(null);

    return (
        <TimeContext.Provider value={{timeData,setTimeData}}>
            {children}
        </TimeContext.Provider>
    );
}

export default TimeContextProvider;