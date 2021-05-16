import { useState, useEffect } from "react";
import { httpCheck } from "../../common";
import "../../css/main.css";
import { TopBar } from "../TopBar";


const Main = () => {
    httpCheck();

    return(
        <div className="main">
            <TopBar/>
            <p className="p-content">Listening is Everything.</p>
        </div>
    );
};


export default Main;