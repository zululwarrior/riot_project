import React, { createContext, useContext, useReducer } from 'react';

import RiotService from '../services/RiotService';
import { UserContext } from './UserContext';

const MasteryContext = createContext();

const MasteryProvider = (props) => {
  const userContext = useContext(UserContext);

  const initialState = {
    allChamps: [],
    champs: [],
    champIdx: 4,
    loading: false,
    error: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'RESET_IDX':
        return { error: false, loading: false, champIdx: 4 };
      case 'SET_LOADING':
        return { ...state, error: false, loading: true };
      case 'SET_ERROR':
        return { error: true, loading: false, champIdx: 4 };
      case 'GET_CHAMPS':
        return {
          ...action.payload,
          error: false,
          loading: false,
          champIdx: action.payload.champIdx + 5,
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

  const getChamps = async () => {
    setLoading();
    const champs = [];
    const allMasteryChamps = await RiotService.getChampInfo(
      userContext.user.id
    );
    const { data: allChamps } = await RiotService.getAllChamps();
    for (var i = 0; i < allMasteryChamps.length; i++) {
      for (var j in allChamps) {
        if (allChamps[j].key == allMasteryChamps[i].championId) {
          champs.push({
            name: allChamps[j].id,
            id: allMasteryChamps[i].championId,
            points: allMasteryChamps[i].championPoints,
          });
        }
      }
      if (i === 4) break;
    }

    dispatch({
      type: 'GET_CHAMPS',
      payload: { champs, champIdx: 4 },
    });
  };

  const loadMore = async () => {
    setLoading();
    const allChampsReturn = [];
    const champs = [];
    const allMasteryChamps = await RiotService.getChampInfo(
      userContext.user.id
    );
    const { data: allChamps } = await RiotService.getAllChamps();
    for (var i = 0; i < allMasteryChamps.length; i++) {
      for (var j in allChamps) {
        allChampsReturn.push({ id: j.key, name: j.id });
        if (allChamps[j].key == allMasteryChamps[i].championId) {
          champs.push({
            name: allChamps[j].id,
            id: allMasteryChamps[i].championId,
            points: allMasteryChamps[i].championPoints,
          });
        }
      }
      if (i === state.champIdx) break;
    }
    dispatch({
      type: 'GET_CHAMPS',
      payload: { champs, champIdx: state.champIdx, allChamps: allChampsReturn },
    });
  };

  return (
    <MasteryContext.Provider
      value={{
        allChamps: state.allChamps,
        champs: state.champs,
        loading: state.loading,
        error: state.error,
        loadMore,
        getChamps,
      }}
      {...props}
    />
  );
};

export { MasteryContext, MasteryProvider };
