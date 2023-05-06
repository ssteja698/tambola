import Router from "next/router";
import { USER_TOKEN_KEYS } from "../../constants/userConstants";

import { cookieRemove, cookieSet } from "./storage";

export const getBrowserInfo = () => {
    // var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = "" + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if (
        (nameOffset = nAgt.lastIndexOf(" ") + 1) <
        (verOffset = nAgt.lastIndexOf("/"))
    ) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt("" + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = "" + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    return {
        browserName,
        fullVersion,
        majorVersion,
        appName: navigator.appName,
        userAgent: navigator.userAgent,
    };
};

export const getOsInfo = () => {
    let OSName = "Unknown OS";
    if (typeof navigator != "undefined") {
        if (navigator.userAgent.indexOf("Win") != -1) OSName = "Windows";
        if (navigator.userAgent.indexOf("Mac") != -1) OSName = "Macintosh";
        if (navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
        if (navigator.userAgent.indexOf("Android") != -1) OSName = "Android";
        if (navigator.userAgent.indexOf("like Mac") != -1) OSName = "iOS";
    }
    return OSName;
};

export const customOSHeader = () => {
    let finTemp =
        typeof navigator !== "undefined"
            ? getBrowserInfo().browserName
            : "Android";

    switch (finTemp) {
        case "Safari":
            return "iOS";
        case "Chrome":
        case "Firefox":
            return "Android";
    }
};

export const getDeviceType = () => {
    if (typeof navigator != "undefined") {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (
            /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            return "mobile";
        }
        return "desktop";
    }
};

/**
 * Setting User auth data to cookie for future use.
 *
 * @param {Object} authObj Object is given by server after login/signup
 */
export const setAuthCookie = (authObj = {}) => {
    cookieSet(USER_TOKEN_KEYS.TOKEN, authObj.access_token);
    cookieSet(USER_TOKEN_KEYS.REFRESH_TOKEN, authObj.refresh_token);
    cookieSet(USER_TOKEN_KEYS.ACCOUNT_ID, authObj.account_id);
    cookieSet(USER_TOKEN_KEYS.PROFILE_ID, authObj.profile_id);
    cookieSet(USER_TOKEN_KEYS.PROFILE_SESSION_ID, authObj.profile_session_id);
    cookieSet(USER_TOKEN_KEYS.VERIFICATION_TOKEN, authObj.verification_token);
};

export const removeAuthCookie = () => {
    for (let value of Object.values(USER_TOKEN_KEYS)) cookieRemove(value);
};

export const logout = () => {
    removeAuthCookie();
    Router.push("/");
};