import "../../css/topbar.css";
import React from "react";
// import logo from "../../assets/bluelogo.svg";
// import logo from "../../assets/bluelogo-blackwhite.svg";
import logo from "../../assets/latest-whiteblack.svg";
import blackwhite from "../../assets/latest-blackwhite.svg";
import bluewhite from "../../assets/latest-bluewhite.svg";
import whiteblack from "../../assets/latest-whiteblack.svg";
import linkedin from "../../assets/linkedin-blue.svg";
import github from "../../assets/github-blue.svg";


export const TopBar = ({ picture, name, exists, handler, event, downloadHandler }) => {
    const route = from => {
        if (from === "player") {
            window.location.href = "/login";
        } else if (from === "signup") {
            window.location.href = "/signup";
        } else if (from === "login") {
            window.location.href = "/login";
        }
    };

    return(
        <div className="topbar">
            <div className="innertopbar">
                <div className="logopart">
                    <img src={logo} className="logo" alt="" />
                    <span>Studio</span>
                </div>
                <div className="menupart">
                    {/* <div className="launch-player">
                        <p onClick={() => route("player")}>Launch Player</p>
                        <img src={linkedin} />
                    </div> */}
                    <div className="download-android">
                        <p onClick={downloadHandler}>Download for Android</p>
                    </div>
                    {
                        event !== null ?
                        <div style={{ height: "100%", width: "15px" }}>
                        </div> : null
                    }
                    {
                        event !== null ?
                        <div className="logintab">
                            <p onClick={handler}>Install</p>
                            {/* <img src={github} /> */}
                        </div> : null
                    }
                    {/* <img src={linkedin} className="linkedin" />
                    <img src={github} className="github" /> */}
                    {
                        exists ?
                        <div style={{ height: "100%", width: "30px" }}></div> : null
                    }
                    {
                        exists ?
                        <div className="profilepart">
                            <div className="profilepart-inner" title={name}>
                                <img src={picture} alt="" />
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        </div>
    );
};


export const LoginTopBar = ({ dark }) => {
    return(
        <div className={ dark ? "login-top dark" : "login-top" }>
            <img src={ dark ? whiteblack : blackwhite } alt="" />
            <span>Studio</span>
        </div>
    );
};