import React, { useContext, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

import { UserContext } from '../context/UserContext';
import { queues } from '../queues';
import { convertToTimeAgo, convertToTime } from '../services/timeConversions';
import { allChamps } from '../champs';
import { summs } from '../summs';
import { champColors, styleColors } from '../colors';
import ExtraStats from './ExtraStats';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  background-color: ${({ color }) => color.background};
  border-style: solid;
  border-width: 1px;
  border-color: ${({ color }) => color.border};
  margin-bottom: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  border-bottom-style: inherit;
  border-width: inherit;
  border-color: inherit;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  height: 90px;
`;

const ItemsContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const ItemsMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 87px;
`;

const ChampInfoContainer = styled.div`
  display: flex;
`;

const SummsInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SummImage = styled.img`
  width: 25px;
  height: 25px;
  margin: 1px;
`;

const ChampionImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: solid black;
  margin: 5px;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  margin: 5px 5px 5px 0px;
`;

const Kda = styled.span`
  color: ${({ kda }) => (kda >= 1 ? 'green' : 'rgb(128, 6, 6)')};
  font-weight: bold;
`;

const ItemImage = styled.img`
  width: 25px;
  height: 25px;
  margin: 2px;
`;

const EmptySquare = styled.div`
  width: 25px;
  height: 25px;
  background-color: grey;
  border: solid black 1px;
  margin: 2px;
`;

const RestSummonersContainer = styled.div`
  display: flex;
  margin-right: 5px;
`;

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Summoner = styled.div`
  display: flex;
  align-items: center;
`;

const SummonerName = styled.div`
  width: 100px;
  font-size: 0.9em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: ${({ name, currName }) =>
    name === currName ? 'bold' : 'normal'};
`;

const SmallChampImg = styled.img`
  width: 15px;
  height: 15px;
  margin: 1px 3px 1px 1px;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
`;

const Anchor = styled.a`
  &:visited,
  &:link,
  &:visited,
  &:hover,
  &:active {
    color: black;
    text-decoration: none;
  }
`;

const ShowMoreContainer = styled.a`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  border-left: solid ${({ color }) => color.border} 1px;
  cursor: pointer;
`;

const Arrow = styled.div`
  position: relative;
  border: solid ${({ color }) => color.border};
  height: 9px;
  width: 9px;
  border-width: 0 3px 3px 0;
  display: inline-block;
  margin: 5px;
  transform: ${({ show }) => (show ? 'rotate(225deg)' : 'rotate(45deg)')};
`;

const calcKda = (k, d, a) => {
  return d === 0 ? k + a : Math.round(((k + a) / d) * 10) / 10;
};

const calcKp = (k, a, tk) => {
  return tk === 0 ? 0 : Math.round(((k + a) / tk) * 100);
};

const MatchHistory = ({ match, participantId }) => {
  const { user } = useContext(UserContext);
  const [showExtra, setShowExtra] = useState(false);

  const queue = queues.find((queue) => queue.queueId === match.queueId);

  const {
    championId,
    stats,
    spell1Id,
    spell2Id,
    teamId,
  } = match.participants.find(
    (participant) => participant.participantId === participantId
  );
  let totalKills = 0;
  match.participants.forEach((participant) => {
    if (participant.teamId === teamId)
      totalKills = totalKills + participant.stats.kills;
  });

  const champ = Object.entries(allChamps).find((champ) => {
    return parseInt(champ[1].key) === championId;
  });

  const champName = champ[1].id;
  const items = [];
  let trinket = '';
  for (const stat in stats) {
    if (stat === 'item6') {
      trinket = stats[stat];
      continue;
    }
    if (stat.includes('item')) items.push(stats[stat]);
  }

  const { champLevel, neutralMinionsKilled, totalMinionsKilled } = stats;

  const summsToShow = [];
  for (const [, value] of Object.entries(summs)) {
    if (parseInt(value.key) === spell1Id) summsToShow.unshift(value.id);
    else if (parseInt(value.key) === spell2Id) summsToShow.push(value.id);
  }

  const participantsArr1 = [];
  const participantsArr2 = [];
  for (let i = 0; i < match.participants.length; i++) {
    const champ = Object.entries(allChamps).find((champ) => {
      return parseInt(champ[1].key) === match.participants[i].championId;
    });
    if (i < 5)
      participantsArr1.push({
        name: match.participantIdentities[i].player.summonerName,
        playerDetails: match.participants[i],
        champ: champ[0],
        selected: false,
        color: champColors[match.participants[i].participantId],
      });
    else
      participantsArr2.push({
        name: match.participantIdentities[i].player.summonerName,
        playerDetails: match.participants[i],
        champ: champ[0],
        selected: false,
        color: champColors[match.participants[i].participantId],
      });
  }

  const handleClick = (e) => {
    e.preventDefault();
    setShowExtra(!showExtra);
  };

  let color;
  stats.win ? (color = styleColors.win) : (color = styleColors.loss);
  return (
    <Container color={color}>
      <Header>
        <div>
          <b>{queue ? queue.description : 'Game'}</b>
        </div>
        <div> &nbsp; {convertToTimeAgo(match.timestamp)}</div>
        <div>&nbsp; {convertToTime(match.gameDuration)}</div>
      </Header>
      <Body>
        <ChampInfoContainer>
          <ChampionImage
            src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${champName}.png`}
            alt={champName}
          ></ChampionImage>
          <SummsInfoContainer>
            {summsToShow.map((summ, i) => (
              <SummImage
                src={`http://ddragon.leagueoflegends.com/cdn/11.1.1/img/spell/${summ}.png`}
                alt={summ}
                key={i}
              />
            ))}
          </SummsInfoContainer>
        </ChampInfoContainer>
        <StatsContainer>
          <div>{stats.kills + '/' + stats.deaths + '/' + stats.assists}</div>
          <div>
            KDA
            <Kda kda={calcKda(stats.kills, stats.deaths, stats.assists)}>
              {' ' + calcKda(stats.kills, stats.deaths, stats.assists)}
            </Kda>
          </div>
        </StatsContainer>
        <StatsContainer>
          <div>Level {champLevel}</div>
          <div>
            CS {neutralMinionsKilled + totalMinionsKilled}
            {' ('}
            {Math.round(
              ((neutralMinionsKilled + totalMinionsKilled) /
                (match.gameDuration / 60)) *
                10
            ) / 10}
            {')'}
          </div>
          <div>{calcKp(stats.kills, stats.assists, totalKills) + '% KP'}</div>
        </StatsContainer>
        <ItemsContainer>
          <ItemsMain>
            {items.map((item, i) => {
              return item === 0 ? (
                <EmptySquare key={i} />
              ) : (
                <ItemImage
                  src={`http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/${item}.png`}
                  alt={item}
                  key={i}
                ></ItemImage>
              );
            })}
          </ItemsMain>
          <ItemImage
            src={`http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/${trinket}.png`}
            alt={trinket}
          ></ItemImage>
        </ItemsContainer>
        <RestSummonersContainer>
          <TeamContainer>
            {participantsArr1.map((participant, i) => (
              <Summoner key={i}>
                <SmallChampImg
                  src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${participant.champ}.png`}
                  alt={participant.champ}
                />
                <SummonerName name={participant.name} currName={user.name}>
                  <Anchor
                    href={`/user/${participant.name}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {participant.name}
                  </Anchor>
                </SummonerName>
              </Summoner>
            ))}
          </TeamContainer>
          <TeamContainer>
            {participantsArr2.map((participant, i) => (
              <Summoner key={i}>
                <SmallChampImg
                  src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${participant.champ}.png`}
                  alt={participant.champ}
                />
                <SummonerName name={participant.name} currName={user.name}>
                  <Anchor
                    href={`/user/${participant.name}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {participant.name}
                  </Anchor>
                </SummonerName>
              </Summoner>
            ))}
          </TeamContainer>
        </RestSummonersContainer>
        <ShowMoreContainer color={color} onClick={handleClick}>
          <Arrow show={showExtra} color={color} />
        </ShowMoreContainer>
      </Body>
      {showExtra && (
        <ExtraStats
          matchId={match.gameId}
          color={color}
          team1={participantsArr1}
          team2={participantsArr2}
          mapId={match.mapId}
        />
      )}
    </Container>
  );
};

export default MatchHistory;
