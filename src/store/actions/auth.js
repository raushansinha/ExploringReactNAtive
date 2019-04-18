import { AsyncStorage } from 'react-native';
import { TRY_AUTH, SET_AUTH_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from '../../screens/MainTabs/startMainTab';
import App from "../../../App";

export const tryAuth = (authData, authMode) => {
    const API_KEY = "AIzaSyBuQNkejIbK_Xm0gmP26hKmI2uiNdLOd6w"
    return dispatch => {
        dispatch(uiStartLoading());
        url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + API_KEY
        if (authMode !== "login") {
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + API_KEY
        }

        fetch(url,
            {
                method: "POST",
                body: JSON.stringify({
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                }),
                headers: {
                    "content-type": "application/json"
                }
            })
            .catch(err => {
                console.log("Error: " + err);
                alert("Authentication failed, please try again!");
                dispatch(uiStopLoading());
            })
            .then(resp => resp.json())
            .then(parsedResp => {
                console.log(parsedResp);
                dispatch(uiStopLoading());
                if (!parsedResp.idToken) {
                    alert("Authentication failed, please try again!");
                } else {
                    dispatch(authStoreToken(parsedResp.idToken, parsedResp.expiresIn, parsedResp.refreshToken));
                    startMainTabs();
                }
            });
    }
};

export const authStoreToken = (token, expiresIn, refreshToken) => {
    return dispatch => {
        const now = new Date();
        const expiryDate = now.getTime() + expiresIn * 1000;
        dispatch(setAuthToken(token, expiryDate));
        AsyncStorage.setItem("ern:auth:token", token);
        AsyncStorage.setItem("ern:auth:expiryDate", expiryDate.toString());
        AsyncStorage.setItem("ern:auth:refreshToken", refreshToken);
    }
}

export const setAuthToken = (token, expiryDate) => {
    return {
        type: SET_AUTH_TOKEN,
        token: token,
        expiryDate: expiryDate
    }
}

export const getAuthToken = () => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => {
            token = getState().auth.token;
            expiryDate = getState().auth.expiryDate;
            if (!token || new Date(expiryDate) <= new Date()) {
                let fetchedToken;
                AsyncStorage.getItem("ern:auth:token")
                    .catch(err => reject(err))
                    .then(tokenFromStorage => {
                        fetchedToken = tokenFromStorage;
                        if (!tokenFromStorage) {
                            reject();
                            return;
                        }
                        return AsyncStorage.getItem("ern:auth:expiryDate");
                    })
                    .then(expiryDate => {
                        const parseExpiryDate = new Date(parseInt(expiryDate));
                        const now = new Date();
                        if (parseExpiryDate > now) {
                            dispatch(setAuthToken(fetchedToken));
                            resolve(fetchedToken);
                        } else {
                            reject();
                        }
                    })
                    .catch(err => {
                        reject();
                    });
            } else {
                resolve(token);
            }
        });
        return promise
            .catch(err => {
            return AsyncStorage.getItem("ern:auth:refreshToken")
                .then(refreshToken => {
                    return fetch("https://securetoken.googleapis.com/v1/token?key=" + API_KEY, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: "grant_type=refresh_token&refresh_token" + refreshToken
                    });
                })
                .then(resp => {
                    if(resp.ok) {
                        return resp.json();
                    } else {
                        throw(new Error());
                    }
                })
                .then(parsedResp => {
                    console.log("Refresh token worked!!!");
                    if (!parsedResp.id_token) {
                        dispatch(authClearStorage());
                        alert("Authentication failed, please try again!");
                    } else {
                        dispatch(authStoreToken(parsedResp.id_token, parsedResp.expires_in, parsedResp.refresh_token));
                        //startMainTabs();
                        return parsedResp.id_token;
                    }
                });
        }).
        then(token => {
            if(!token) {
                throw new Error("New Error")
            } else {
                return token;
            }
        });
    }
}

export const authAutoSignIn = () => {
    return dispatch => {
        dispatch(getAuthToken())
            .then(tokenFromStorage => {
                startMainTabs();
            })
            .catch(() => console.log("Token not available"));
    }
}

export const authClearStorage = () => {
    return dispatch => {
        AsyncStorage.removeItem("ern:auth:token");
        AsyncStorage.removeItem("ern:auth:expiryDate");
        return AsyncStorage.removeItem("ern:auth:refreshToken");
    }
}

export const authLogout = () => {
    return dispatch => {
        dispatch(authClearStorage())
            .then(() => {
                App();
            });
        dispatch(authRemoveToken());
    }
}

export const authRemoveToken = () => {
   return {
       type: AUTH_REMOVE_TOKEN
   }
}

