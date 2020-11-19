import * as ActionTypes from './ActionTypes';
import axios from 'axios';
import { baseURL } from '../shared/baseURL';

export const userLoading = () => ({
    type: ActionTypes.USER_LOADING
});

export const addUser = (user) => ({
    type: ActionTypes.ADD_USER,
    payload: user
});

export const failedUser = (errMsg) => ({
    type: ActionTypes.USER_FAILED,
    payload: errMsg
});

export const removeUser = () => ({
    type: ActionTypes.REMOVE_USER
});

export const postRegistration = (firstname,lastname,phone,email,role,password) => (dispatch) => {

    dispatch(userLoading());

    const newUser = {
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        email: email,
        role: role,
        password: password
    };


    axios.post(baseURL + '/users/newUser',newUser)
        .then((response) => {
            if (response.data.success) {
                dispatch(addUser(response.data.user));
            } else {
                dispatch(failedUser(response.data.message));
            }
        })
        .catch((err) => {
            console.log(err);
            dispatch();
        });

};

export const loginUser = (email,password) => (dispatch) => {

    dispatch(userLoading());

    const cred = {
        email: email,
        password: password
    };

    axios.post(baseURL + '/users/login' ,cred)
        .then((response) => {
            if (response.data.success) {
                dispatch(addUser(response.data.user));
            } else {
                dispatch(failedUser(response.data.message));
            }
        })
        .catch((err) => {
            console.log(err);
            dispatch(failedUser('Failed to login'));
        }); 
} 

export const logoutUser = () => (dispatch) => {
    console.log('logout called');
    dispatch(removeUser());
};