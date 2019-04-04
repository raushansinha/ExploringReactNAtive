import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading, getAuthToken } from './index';

export const addPlace = (placeName, location, image) => {
    return (dispatch) => {

        dispatch(uiStartLoading());

        dispatch(getAuthToken())
        .catch(err => {
            console.log("Error: " + err);
            alert("Smothing went wrong, please try again!");
        })
        .then( token => {
            fetch("https://us-central1-exploring-react-native.cloudfunctions.net/storeImage", {
            method: "POST",
            body: JSON.stringify({
                image: image.base64
            }),
            headers: {
                authorization: "Bearer " + token
            }
            })
            .catch(err => {
                console.log("Error: " + err);
                alert("Smothing went wrong, please try again!");
                dispatch(uiStopLoading());
            })
            .then(resp => resp.json())
            .then(parsedResp => {
                const placeData = {
                    name: placeName,
                    location: location,
                    image: parsedResp.imageUrl
                };

                return fetch("https://exploring-react-native.firebaseio.com/places.json?auth=" + token, {
                    method: "POST",
                    body: JSON.stringify(placeData)
                })
            
                .then(resp => resp.json())
                .then(parsedResp => {
                    console.log(parsedResp);
                    dispatch(uiStopLoading());
                })
                .catch(err => {
                    console.log("Error: " + err);
                    alert("Smothing went wrong, please try again!");
                    dispatch(uiStopLoading());
                });
            });
        });
    };
};

export const getPlaces = () => {
    return dispatch => {

        dispatch(getAuthToken())
            .then(token => {
                return fetch("https://exploring-react-native.firebaseio.com/places.json?auth=" + token)
            })
            .catch(err => {
                console.log("Error: " + err);
                alert("Not authenticated, please try again!");
            })
        .then(resp => resp.json())
        .then(parsedResp => {
            const places = [];
            for(let key in parsedResp) {
                places.push({
                    ...parsedResp[key],
                    image: {
                        uri: parsedResp[key].image
                    },
                    key: key
                });
            }
            dispatch(setPlaces(places))
        })
        .catch(err => {
            console.log("Error: " + err);
            alert("Smothing went wrong, please try again!");
        });
    }
}

export const setPlaces = places => {
    return {
        type: SET_PLACES,
        places: places
    }
}

export const deletePlace = (key) => {
    return dispatch => {

        dispatch(getAuthToken())
        .then(token => {
            dispatch(removePlace(key))
            return fetch("https://exploring-react-native.firebaseio.com/places/" + key + ".json?auth=" + token, {
                method: "DELETE",
            })
        })
        .catch(err => {
            console.log("Error: " + err);
            alert("Not authenticated, please try again!");
        })
        .then(resp => resp.json())
        .then(parsedResp => {
            console.log("Deleted!")
        })
        .catch(err => {
            console.log("Error: " + err);
            alert("Smothing went wrong, please try again!");
        });
    }
};


export const removePlace = (key) => {
    return {
        type: REMOVE_PLACE,
        key: key
    }
}