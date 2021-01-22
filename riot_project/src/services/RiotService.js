import key from '../config';

const RiotService = {
  getSummoner: async (username) => {
    const res = await fetch(
      `http://localhost:8080/https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${key.key}`
    );
    const data = await res.json();
    return data;
  },
  getSummonerRank: async (summonerId) => {
    const res = await fetch(
      `http://localhost:8080/https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${key.key}`
    );
    const data = await res.json();
    return data;
  },
  getChampInfo: async (encUsername) => {
    const res = await fetch(
      `http://localhost:8080/https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${encUsername}?api_key=${key.key}`
    );
    const data = await res.json();
    return data;
  },
  getAllChamps: async () => {
    const res = await fetch(
      'http://ddragon.leagueoflegends.com/cdn/10.18.1/data/en_US/champion.json'
    );
    const data = await res.json();
    return data;
  },
  getMatches: async (accountId, start, end) => {
    const returnValue = {
      matches: [],
    };
    const res = await fetch(
      `http://localhost:8080/https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=${end}&beginIndex=${start}&api_key=${key.key}`
    );

    const { matches } = await res.json();

    for (const match of matches) {
      const data = await fetch(
        `http://localhost:8080/https://euw1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${key.key}`
      );
      const fullMatch = await data.json();
      const value = { ...match, ...fullMatch };
      returnValue.matches.push(value);
    }
    return returnValue;
  },
  getTimeline: async (matchId) => {
    const res = await fetch(
      `http://localhost:8080/https://euw1.api.riotgames.com/lol/match/v4/timelines/by-match/${matchId}?api_key=${key.key}`
    );
    const { frames } = await res.json();
    console.log(frames);
    return frames;
  },
};

export default RiotService;
