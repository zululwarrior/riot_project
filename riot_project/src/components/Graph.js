import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import styled from 'styled-components';

import { convertToTime } from '../services/timeConversions';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MapContainer = styled.div`
  margin-top: 5px;
  position: relative;
`;

const Map = styled.img``;

const HoverTooltip = styled.div`
  position: relative;
  min-width: 200px;
  background-color: rgb(46, 46, 46);
  border: solid white 1px;
  color: white;
  padding: 10px 0 10px 0;
  z-index: 100;
  display: none;
`;

const PointWrapper = styled.div`
  position: absolute;
  left: ${({ position }) => {
    return position.x / 156;
  }}%;
  bottom: ${({ position }) => position.y / 156}%;
  &:hover ${HoverTooltip} {
    display: flex;
    justify-content: center;
  }
`;

const KillPoint = styled.div`
  height: 16px;
  width: 16px;
  border-radius: 50%;
  border: solid black 1px;
  background-color: ${({ champColors, name }) => {
    for (const [key, value] of Object.entries(champColors)) {
      if (key === name) {
        return value;
      }
    }
  }};
  opacity: 70%;
`;

const DeathPoint = styled(KillPoint)`
  border-radius: 100%;
  border: solid red 3px;
`;

const Button = styled.button`
  width: 80px;
  margin-top: 5px;
  padding: 5px 5px 5px 5px;
`;

const ChampImg = styled.img`
  height: 15px;
  width: 15px;
  margin: 2px 5px 0 5px;
`;

const Graph = ({
  data,
  champColors,
  mapId,
  selectedCategory,
  deathsTimeline,
  selectedChamps,
  allChamps,
}) => {
  const killsToShow = [];
  const [showKills, setShowKills] = useState(true);

  deathsTimeline.forEach((death) => {
    selectedChamps.forEach((champ) => {
      if (showKills) {
        if (champ.participantId === death.killerId) {
          allChamps.forEach((allChamp) => {
            if (allChamp.participantId === death.victimId) {
              killsToShow.push({
                ...death,
                name: champ.name,
                victim: allChamp.champ,
              });
            }
          });
        }
      } else {
        if (champ.participantId === death.victimId) {
          allChamps.forEach((allChamp) => {
            if (allChamp.participantId === death.killerId) {
              killsToShow.push({
                ...death,
                name: allChamp.champ,
                victim: champ.name,
              });
            }
          });
        }
      }
    });
  });

  return (
    <Container>
      {selectedCategory === 'deaths' ? (
        <>
          <Button
            onClick={() => {
              setShowKills(!showKills);
            }}
          >
            {showKills ? 'Kills' : 'Deaths'}
          </Button>
          <MapContainer>
            <Map
              src={`http://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map${mapId}.png`}
              alt={'map'}
            />
            {killsToShow.map((death) => {
              return showKills ? (
                <PointWrapper position={death.position}>
                  <HoverTooltip>
                    <ChampImg
                      src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${death.name}.png`}
                      alt={death.name}
                    />
                    killed
                    <ChampImg
                      src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${death.victim}.png`}
                      alt={death.victim}
                    />
                    at {convertToTime(Math.round(death.timestamp / 1000))}
                  </HoverTooltip>
                  <KillPoint champColors={champColors} name={death.name} />
                </PointWrapper>
              ) : (
                <PointWrapper position={death.position}>
                  <HoverTooltip>
                    <ChampImg
                      src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${death.name}.png`}
                      alt={death.name}
                    />
                    killed
                    <ChampImg
                      src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${death.victim}.png`}
                      alt={death.victim}
                    />
                    at {convertToTime(Math.round(death.timestamp / 1000))}
                  </HoverTooltip>
                  <DeathPoint champColors={champColors} name={death.victim} />
                </PointWrapper>
              );
            })}
          </MapContainer>
        </>
      ) : (
        <LineChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' fill='white' fillOpacity='0.9' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip itemSorter={(item) => -item.value} />
          <Legend />
          {data.length
            ? Object.keys(data[0]).map((key) => {
                if (key !== 'name') {
                  if (champColors[key])
                    return (
                      <Line
                        type='monotone'
                        dataKey={key}
                        stroke={champColors[key]}
                      />
                    );
                  else {
                    if (key === 'Blue Team')
                      return (
                        <Line type='monotone' dataKey={key} stroke={'blue'} />
                      );
                    else
                      return (
                        <Line type='monotone' dataKey={key} stroke={'red'} />
                      );
                  }
                }
                return null;
              })
            : 'loading'}
        </LineChart>
      )}
    </Container>
  );
};

export default Graph;
