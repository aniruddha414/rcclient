import * as ActionTypes  from './ActionTypes';

export const User  = (state = {
   user: null,
   isLoading: false,
   errMsg: null
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_USER:
              return {...state, isLoading: false, errMsg: null, user: action.payload};
  
          case ActionTypes.USER_LOADING:
              return {...state, isLoading: true, errMsg: null, user: null}
  
          case ActionTypes.USER_FAILED:
              return {...state, isLoading: false, errMsg: action.payload, user:null};

          case ActionTypes.REMOVE_USER:
              return {...state, isLoading: false, errMsg: null, user:null};

          default:
            return state;
        }
};