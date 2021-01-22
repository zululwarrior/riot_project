import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PieChart } from 'react-minimal-pie-chart';
import { useParams } from 'react-router-dom';

import { MatchHistoryContext } from '../context/MatchHistoryContext';
import { UserContext } from '../context/UserContext';
import MatchHistory from './MatchHistory';

const Container = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  width: 50%;
  align-self: center;
`;

const WinRate = styled.div`
  width: 400px;

  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 5px 5px 0 5px;
  padding-bottom: 5px;
`;

const ChartContainer = styled.div`
  width: 50px;
  height: 50px;
`;

const MatchHistories = () => {
  const context = useContext(MatchHistoryContext);
  const { user } = useContext(UserContext);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  useEffect(() => {
    context.getMatches();
  }, []);

  useEffect(() => {
    let wins = 0;
    let losses = 0;
    context.matches.forEach((match) => {
      const { participantId } = match.participantIdentities.find(
        (participant) => user.accountId === participant.player.currentAccountId
      );
      const { stats } = match.participants.find(
        (participant) => participantId === participant.participantId
      );
      stats.win ? wins++ : losses++;
    });
    setWins(wins);
    setLosses(losses);
  }, [context.matches]);

  const handleClick = (e) => {
    e.preventDefault();
    context.getMatches();
  };

  if (context.loading) {
    return (
      <Container>
        <div>loading</div>
      </Container>
    );
  } else if (context.error) {
    return (
      <Container>
        <div>error</div>
      </Container>
    );
  } else {
    return (
      <Container>
        <WinRate>
          <div>{wins} wins</div>
          <div>{losses} losses</div>
          <div>{context.matches.length} games</div>
          <ChartContainer>
            <PieChart
              data={[
                { value: wins, color: 'rgb(66, 245, 135)' },
                {
                  value: losses,
                  color: 'rgb(247, 109, 96)',
                },
              ]}
              startAngle={90}
            />
          </ChartContainer>
          <div>
            {Math.round((wins / context.matches.length) * 100)}% winrate
          </div>
        </WinRate>
        {context.matches.map((match, i) => {
          const { participantId } = match.participantIdentities.find(
            (participant) =>
              user.accountId === participant.player.currentAccountId
          );
          return (
            <MatchHistory
              key={match.gameId}
              match={match}
              participantId={participantId}
            />
          );
        })}
        <Button onClick={handleClick}>Load More</Button>
      </Container>
    );
  }
};

export default MatchHistories;
