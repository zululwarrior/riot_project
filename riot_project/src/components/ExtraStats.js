import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { MatchHistoryContext } from '../context/MatchHistoryContext';
import Graph from './Graph';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-top: solid ${({ color }) => color.border} 1px;
`;

const NavContainerChamp = styled.div`
  position: relative;
  height: 40px;
  background-color: rgb(245, 245, 245);
  border-bottom: solid grey 1px;
  border-top: solid grey 1px;
  width: 100%;
`;

const NavContainer = styled.div`
  position: relative;
  height: 32px;
  width: 100%;
  background-color: ${({ color }) => color.navColor};
`;

const NavBar = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  bottom: -1px;
`;

const NavBarSection = styled.div`
  display: flex;
  justify-content: space-around;
`;

const NavItem = styled.div`
  position: relative;
  margin-top: 10px;
  padding: 5px 8px 2px 8px;
  border: ${({ selected, name, color }) =>
    `solid ${selected === name ? 'grey' : color.border} 1px`};
  border-bottom: ${({ selected, name, color }) =>
    `solid ${selected === name ? 'rgb(245, 245, 245)' : `grey`} 1px`};
  background-color: ${({ selected, name, color }) =>
    `${selected === name ? 'rgb(245, 245, 245)' : `${color.item}`}`};
  z-index: ${({ selected, name }) => `${selected === name ? '1' : `0`}`};

  cursor: pointer;
`;

const NavItemChamp = styled.div`
  margin: 5px 3px 0 3px;
  border: solid grey;
  border-bottom: none;
  border-width: 1px;
  padding: 2px 8px 0 8px;
  background-color: ${({ selected, color }) => (selected ? color : 'white')};
  cursor: pointer;
`;

// const NavBar = styled.div`
//   background-color: white;
//   width: 100%;
//   display: flex;
//   justify-content: space-around;
//   border-bottom: solid black 2px;
// `;

const SmallChampImg = styled.img`
  width: 25px;
  height: 25px;
`;

const ExtraStats = ({ matchId, color, team1, team2, mapId }) => {
  const context = useContext(MatchHistoryContext);
  const [timeline, setTimeline] = useState([]);
  const [selectedChamps, setSelectedChamps] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('teamGold');
  const [showChamps, setShowChamps] = useState(false);
  const allChamps = [];
  let champColors = {};

  team1.forEach((participant) => {
    champColors[`${participant.champ}`] = participant.color;
    allChamps.push({
      participantId: participant.playerDetails.participantId,
      champ: participant.champ,
    });
  });
  team2.forEach((participant) => {
    champColors[`${participant.champ}`] = participant.color;
    allChamps.push({
      participantId: participant.playerDetails.participantId,
      champ: participant.champ,
    });
  });

  useEffect(() => {
    const getTimeline = async () => {
      const timeline = await context.getTimeline(matchId);
      setTimeline(timeline);
    };
    getTimeline();
  }, []);

  const redTeamPlayersGold = [[]];
  const blueTeamPlayersGold = [[]];
  const data = [];
  const deathsTimeline = [];

  if (timeline.length > 0) {
    if (selectedCategory === 'deaths')
      for (let i = 0; i < timeline.length; i++) {
        for (const [, value] of Object.entries(
          Object.entries(timeline[i])[1][1]
        )) {
          if (value.type === 'CHAMPION_KILL') {
            deathsTimeline.push(value);
          }
        }
      }
    else
      for (let i = 0; i < timeline.length; i++) {
        if (i % 5 === 0 || i === timeline.length - 1) {
          const redTeamsGold = [];
          const blueTeamsGold = [];
          let redTotal = 0;
          let blueTotal = 0;
          const champTotalGold = [];
          for (const [, value] of Object.entries(
            Object.entries(timeline[i])[0][1]
          )) {
            if (selectedCategory === 'teamGold') {
              if (value.participantId <= 5) {
                redTotal += value.totalGold;
                redTeamsGold.push({
                  participantId: value.participantId,
                  totalGold: value.totalGold,
                });
              } else {
                blueTotal += value.totalGold;
                blueTeamsGold.push({
                  participantId: value.participantId,
                  totalGold: value.totalGold,
                });
              }
            } else {
              selectedChamps.forEach((champ) => {
                if (champ.participantId === value.participantId) {
                  champTotalGold.push({
                    participantId: value.participantId,
                    champName: champ.name,
                    totalGold: value.totalGold,
                  });
                }
              });
            }
          }

          if (selectedCategory === 'teamGold') {
            data.push({
              name: `${i} mins`,
              'Red Team': redTotal,
              'Blue Team': blueTotal,
            });
          } else {
            let dataObj = { name: `${i} mins` };
            champTotalGold.forEach((champ) => {
              dataObj[champ.champName] = champ.totalGold;
            });
            data.push(dataObj);
          }

          redTeamPlayersGold.push(redTeamsGold);
          blueTeamPlayersGold.push(blueTeamsGold);
        }
      }
  }

  const selectChamp = (participant) => {
    if (selectedChamps.find((champ) => champ.name === participant.champ)) {
      setSelectedChamps(
        selectedChamps.filter((champ) => champ.name !== participant.champ)
      );
      participant.selected = false;
    } else {
      setSelectedChamps([
        ...selectedChamps,
        {
          name: participant.champ,
          participantId: participant.playerDetails.participantId,
        },
      ]);
      participant.selected = true;
    }
  };

  const changeCategory = (category) => {
    switch (category) {
      case 'teamGold':
        setShowChamps(false);
        setSelectedCategory(category);
        break;
      case 'championGold':
        setShowChamps(true);
        setSelectedCategory(category);
        break;
      case 'deaths':
        setShowChamps(true);
        setSelectedCategory(category);
        break;
      default:
        break;
    }
  };

  return (
    <Container color={color}>
      <NavContainer color={color}>
        <NavBar>
          <NavItem
            onClick={(e) => changeCategory('teamGold')}
            name='teamGold'
            selected={selectedCategory}
            color={color}
          >
            Gold by team
          </NavItem>
          <NavItem
            onClick={(e) => changeCategory('championGold')}
            name='championGold'
            selected={selectedCategory}
            color={color}
          >
            Gold by champion
          </NavItem>
          <NavItem
            onClick={(e) => changeCategory('deaths')}
            name='deaths'
            selected={selectedCategory}
            color={color}
          >
            Deaths map
          </NavItem>
        </NavBar>
      </NavContainer>
      {showChamps ? (
        <NavContainerChamp>
          <NavBar>
            <NavBarSection>
              {team1.map((participant) => {
                return (
                  <NavItemChamp
                    color={participant.color}
                    onClick={(e) => selectChamp(participant)}
                    selected={participant.selected}
                    participantId={participant.playerDetails.participantId}
                  >
                    <SmallChampImg
                      src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${participant.champ}.png`}
                      alt={participant.champ}
                    />
                  </NavItemChamp>
                );
              })}
            </NavBarSection>
            <NavBarSection>
              {team2.map((participant) => {
                return (
                  <NavItemChamp
                    color={participant.color}
                    onClick={(e) => selectChamp(participant)}
                    selected={participant.selected}
                    participantId={participant.playerDetails.participantId}
                  >
                    <SmallChampImg
                      src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${participant.champ}.png`}
                      alt={participant.champ}
                    />
                  </NavItemChamp>
                );
              })}
            </NavBarSection>
          </NavBar>
        </NavContainerChamp>
      ) : (
        <NavContainerChamp color={color}>
          <NavBar>
            <NavBarSection></NavBarSection>
          </NavBar>
        </NavContainerChamp>
      )}

      <Graph
        data={data}
        champColors={champColors}
        mapId={mapId}
        selectedCategory={selectedCategory}
        deathsTimeline={deathsTimeline}
        selectedChamps={selectedChamps}
        allChamps={allChamps}
      />
    </Container>
  );
};

export default ExtraStats;
