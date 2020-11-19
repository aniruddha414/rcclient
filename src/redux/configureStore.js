import {createStore, combineReducers,applyMiddleware} from 'redux';
import { createForms } from 'react-redux-form';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {User} from './user';
import {InitialRegister} from './forms';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            user: User,
            ...createForms({
                register: InitialRegister
            })
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}