import React, { createContext, useReducer, useEffect } from 'react';

import RiotService from '../services/RiotService';

const UserContext = createContext();

const UserProvider = (props) => {
  const initialState = {
    user: null,
    userRank: null,
    loading: false,
    error: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'GET_USER':
        return { ...action.payload, error: false, loading: false };
      case 'SET_LOADING':
        return { ...state, error: false, loading: true };
      case 'SET_ERROR':
        return { error: true, loading: false, champIdx: 4 };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = () => {
    dispatch({ type: 'SET_LOADING' });
  };

  const setError = () => {
    dispatch({ type: 'SET_ERROR' });
  };

  const searchUser = async (username) => {
    setLoading();
    const user = await RiotService.getSummoner(username);
    const userRank = await RiotService.getSummonerRank(user.id);
    console.log(user);

    user.status
      ? setError()
      : dispatch({ type: 'GET_USER', payload: { user, userRank } });
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        userRank: state.userRank,
        loading: state.loading,
        error: state.error,
        searchUser,
      }}
      {...props}
    />
  );
};

export { UserContext, UserProvider };
