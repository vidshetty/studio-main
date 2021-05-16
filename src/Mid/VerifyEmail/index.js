import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/verify-email.css";
import success from "../../assets/success.svg";
import failure from "../../assets/failure.svg";
import {
    httpCheck,
    sendRequest
} from "../../common";
import { LoginTopBar } from "../TopBar";


export const InvalidOrNot = ({ val, ifTrue }) => {
    return(
        <div className="result-container"
        style={{ backgroundColor: `${val === 200 ? "green" : "red"}` }}>
            <div className="resultimg">
                <img src={ val === 200 ? success : failure } alt="" />
            </div>
            <div className="resulttext">
                { val === 200 ? ifTrue : "This link is invalid." }
            </div>
        </div>
    );
};

const Verify = () => {
    httpCheck();
    const { userId, userUUID } = useParams();
    const [result, setResult] = useState({});

    const call = async () => {
        const res = await sendRequest({
            method: "POST",
            endpoint: "/verify-email",
            data: {
                userId,
                userUUID
            }
        });
        setResult(res);
    };

    const goToLogin = () => {
        window.location.href = "/login";
    };

    useEffect(() => {
        document.title = "Email Verification - Studio";
        call();
    }, []);

    return (
        <div className="verify-email">
            <div onClick={goToLogin}>
                <LoginTopBar dark={false} />
            </div>
            <div className="verify-email-body">
                {
                    Object.keys(result).length !== 0 ? <InvalidOrNot val={result.status} ifTrue={"Your email has been verified!"} /> : ""
                }
            </div>
        </div>
    );
};


export default Verify;