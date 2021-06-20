import "../../css/topbar.css";
// import logo from "../../assets/bluelogo.svg";
// import logo from "../../assets/bluelogo-blackwhite.svg";
import logo from "../../assets/latest-whiteblack.svg";
import blackwhite from "../../assets/latest-blackwhite.svg";
import whiteblack from "../../assets/latest-whiteblack.svg";


const TopBar = () => {
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
                    <div className="launch-player">
                        <p onClick={() => route("player")}>Launch Player</p>
                    </div>
                    {/* <div className="signuptab">
                        <p onClick={() => route("signup")}>Sign Up</p>
                    </div> */}
                    <div className="logintab">
                        <p onClick={() => route("login")}>Log In</p>
                    </div>
                    {/* <div className="launch-button" onClick={() => route("login")}>
                        <p>Launch Player</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};


const LoginTopBar = ({ dark }) => {
    return(
        <div className={ dark ? "login-top dark" : "login-top" }>
            <img src={ dark ? whiteblack : blackwhite } alt="" />
            <span>Studio</span>
        </div>
    );
};

export { TopBar, LoginTopBar };