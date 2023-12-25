import React, { useState, useEffect } from "react";
import "../../css/android-download-panel.css";
import "../../css/main.css";
import { sendRequest } from "../../common";
import Logo from "../../assets/512x512.png";
import Button from "../../Button";
import axios from "axios";


export const AndroidDownload = ({
    setOpenAndroidDownload
}) => {

    const [loading, setLoading] = useState(true);
    const [updateData, setUpdateData] = useState(null);

    const close = (e) => {
        setOpenAndroidDownload(false);
    };

    const clickOnContainer = (e) => {
        e.stopPropagation();
    };

    const call = async () => {
        const res = await sendRequest({
            method: "GET",
            endpoint: "/getLatestUpdate",
            to: "api"
        });
        if (!res) return;
        setUpdateData({
            versionCode: res.versionCode,
            versionName: res.versionName
        });
        setLoading(false);
    };

    const download = () => {
        const anchor = document.createElement("a");
        anchor.href = "https://studiomusic.app/android/api/downloadLatestUpdate";
        anchor.target = "_self"
        anchor.click();
    };

    useEffect(() => {
        call();
    }, []);

    return (
        <div className="android-download-panel"
        onClick={close}>
            <div className="download-container"
            onClick={clickOnContainer}>
                {
                    loading ?
                    <>
                        <div style={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div className="main-loader">
                                <div className="main-loaderinner">
                                    <div className="one"></div>
                                    <div className="two"></div>
                                    <div className="three"></div>
                                </div>
                            </div>
                        </div>
                    </> :
                    <>
                        <div className="panel-header">
                            <img src={Logo} width="35px" height="35px" />
                            <div className="panel-title">StudioMusic</div>
                        </div>
                        <div className="panel-text">
                            <p>minimum required android version: 12</p>
                            <div style={{ width: "100%", height: "8px" }}></div>
                            <p>{`Latest version: ${updateData.versionName}`}</p>
                        </div>
                        <div className="panel-button-container">
                            <div className="panel-button" onClick={download}>
                                <p className="panel-button-text">DOWNLOAD</p>
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    );

};