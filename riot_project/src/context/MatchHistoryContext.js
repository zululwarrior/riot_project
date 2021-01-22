import React, { createContext, useContext, useReducer } from 'react';

import RiotService from '../services/RiotService';
import { UserContext } from './UserContext';

const MatchHistoryContext = createContext();

const MatchHistoryProvider = (props) => {
  const userContext = useContext(UserContext);

  const initialState = {
    matches: [],
    loading: false,
    error: false,
    start: 0,
    end: 5,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, loading: true, error: false };
      case 'SET_ERROR':
        return { ...state, loading: false, error: true, start: 0, end: 5 };
      case 'GET_MATCHES':
        return {
          ...action.payload,
          loading: false,
          error: false,
          start: state.start + 5,
          end: state.end + 5,
        };
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

  const getMatches = async () => {
    setLoading();

    const { matches } = await RiotService.getMatches(
      userContext.user.accountId,
      state.start,
      state.end
    );
    matches.status
      ? setError()
      : dispatch({
          type: 'GET_MATCHES',
          payload: { matches: [...state.matches, ...matches] },
        });
  };

  const getTimeline = async (matchId) => {
    const timeline = await RiotService.getTimeline(matchId);
    return timeline;
  };

  return (
    <MatchHistoryContext.Provider
      value={{
        matches: state.matches,
        loading: state.loading,
        error: state.error,
        getMatches,
        getTimeline,
      }}
      {...props}
    />
  );
};

export { MatchHistoryContext, MatchHistoryProvider };
