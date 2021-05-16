import { useState, useEffect } from "react";
import "../../css/login.css";
import { LoginTopBar } from "../TopBar";
import { useLocation } from "react-router-dom";
import {
    sendRequest,
    Error,
    httpCheck
} from "../../common";



const Middle = ({ showPass, setShowPass, err, setErr }) => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    // const [hovered, setHovered] = useState(false);
    // const [focused, setFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmail = e => {
        setEmail(e.target.value);
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
        setErr({ ...err, open: false });
    };

    const handlePassword = e => {
        setPass(e.target.value);
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
        setErr({ ...err, open: false });
        const password = e.target.value;
        if (password === "") {
            return;
        }
    };

    const handleCheckbox = e => {
        setShowPass(e.target.checked);
    };

    const login = async e => {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        const res = await sendRequest({
            method: "POST",
            endpoint: "/login",
            data: {
                text: email,
                password: pass
            }
        });
        setIsLoading(false);
        if (res.error) {
            setErr({
                open: true,
                msg: res.error,
                link: res.link,
                data: res.link ? res.data : {}
            });
            return;
        }
        localStorage.setItem("username",res && res.username);
        localStorage.setItem("userId",res && res.userId);
        localStorage.setItem("email",res && res.email);
        window.location.href = "/";
    };

    const onFocus = e => {
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
    };

    const onBlurPassword = e => {
        e.target.style.border = err.open ? "1px solid red" : "1px solid rgba(0,0,0,0.2)";
    };

    const onBlur = e => {
        e.target.style.border = "1px solid rgba(0,0,0,0.2)";
    };

    const forgotPassword = () => {
        window.location.href = "/forgot-password";
    };

    return(
        <>
        <form className="form" onSubmit={login}>
            <div className="standard-input">
                <label for="email" className="input-header">Enter your email address or username</label>
                <input name="email" autoComplete="true" className="input-box"
                type="text" placeholder="Email address or username" onChange={handleEmail}
                onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div className="standard-input">
                <label for="password" className="input-header">Password</label>
                <input name="password" className="input-box" type={ showPass ? "text" : "password" }
                placeholder="Password" onChange={handlePassword}
                onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div className="standard-input">
                <p className="forgot-password" onClick={forgotPassword}>Forgot your password?</p>
            </div>
            <div className="standard-input lastpart">
                <div className="leftpart">
                    <input type="checkbox" name="show-password" className="checkbox" onChange={handleCheckbox} />
                    <p>Show password</p>
                </div>
                <div className="rightpart">
                    <button className="login-button" type="submit"
                    // onFocus={() => setFocused(true)}
                    // onBlur={() => setFocused(false)}
                    // onMouseOver={() => setHovered(true)}
                    // onMouseOut={() => setHovered(false)}
                    // style={{ backgroundColor: `${ isLoading || hovered || focused ? "#006bff" : "transparent" }` }}
                    >
                        {
                            isLoading ? 
                                <div className="loader">
                                    <div className="loaderinner">
                                        <div className="one"></div>
                                        <div className="two"></div>
                                        <div className="three"></div>
                                    </div>
                                </div> : "LOG IN"
                        }
                    </button>
                </div>
            </div>
        </form>
        </>
    );
};

const Login = () => {
    httpCheck();
    const [err, setErr] = useState({ open: false, msg: "", data: {}, link: false });
    const [showPass, setShowPass] = useState(false);
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const status = query.get("status");
    const email = query.get("email");

    const goToGoogle = e => {
        window.location.href = "/login/google";
    };

    useEffect(() => {
        document.title = "Log In - Studio";
        if (status === "failed") {
            setErr({ ...err, open: true, msg: "OAuth login failed." }); 
        }
        if (status === "success" && email === "exists") {
            setErr({ ...err, open: true, msg: "Email already exists." });
        }
    }, []);

    return(
        <div className="login">
            <LoginTopBar dark={false}/>
            <div className="loginbody">
                <div className="loginbody-inner">
                    <Error err={err} setErr={setErr} />
                    <p className="standard-p">To continue, log in.</p>
                    <div className="standard-button" onClick={goToGoogle}>CONTINUE WITH GOOGLE</div>
                    <div className="line-drawer"></div>
                    <Middle showPass={showPass} setShowPass={setShowPass} err={err} setErr={setErr} />
                    <div className="line-drawer bottom"></div>
                    <p className="standard-p">Don't have an account?</p>
                    <div className="standard-button" onClick={() => window.location.href = "/signup"}>SIGN UP FOR STUDIO</div>
                    <div style={{ width: "100%", height: "50px" }}></div>
                </div>
            </div>
        </div>
    );
};


export default Login;