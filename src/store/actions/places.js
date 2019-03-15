import { SET_PLACES } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';

export const addPlace = (placeName, location, image) => {
    return (dispatch) => {

        dispatch(uiStartLoading());

        fetch("https://us-central1-exploring-react-native.cloudfunctions.net/storeImage", {
            method: "POST",
            body: JSON.stringify({
                image: image.base64
            })
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

            return fetch("https://exploring-react-native.firebaseio.com/places.json", {
                method: "POST",
                body: JSON.stringify(placeData)
            })
            .catch(err => {
                console.log("Error: " + err);
                alert("Smothing went wrong, please try again!");
                dispatch(uiStopLoading());
            })
            .then(resp => resp.json())
            .then(parsedResp => {
                console.log(parsedResp);
                dispatch(uiStopLoading());
            });
        });
    };
};

export const getPlaces = () => {
    return dispatch => {
        return fetch("https://exploring-react-native.firebaseio.com/places.json")
        .catch(err => {
            console.log("Error: " + err);
            alert("Smothing went wrong, please try again!");
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
    return {
        type: DELETE_PLACE,
        placeKey: key
    };
};