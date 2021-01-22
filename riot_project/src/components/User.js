import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { UserContext } from '../context/UserContext';
import Results from './Results';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Emblem = styled.img`
  width: 100px;
  height: 100px;
`;

const UserInfo = styled.div`
  display: flex;
`;
const UserImage = styled.div`
  position: relative;
  margin-right: 10px;
`;

const UserLevel = styled.span`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 50px;
  transform: translateX(-50%);
  background-color: rgb(148, 110, 75);
  border: solid 2px rgb(49, 106, 117);
  color: white;
  height: 20px;
  width: 40px;
`;

const UsernameRank = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Name = styled.span`
  font-weight: bold;
  font-size: 1.5em;
`;

const User = () => {
  const context = useContext(UserContext);
  const { username } = useParams();

  useEffect(() => {
    context.searchUser(username);
  }, []);

  if (context.loading || context.user === null) {
    return <div>loading</div>;
  } else {
    if (context.user === undefined) {
      return 'user not found';
    } else {
      return (
        <Container>
          <UserInfo>
            <UserImage>
              <img
                className='profileImage'
                src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/profileicon/${context.user.profileIconId}.png`}
                alt={context.user.name}
                width='100'
                height='100'
              />
              <UserLevel>{context.user.summonerLevel}</UserLevel>
            </UserImage>
            <UsernameRank>
              <Name>{context.user.name} </Name>
              <span>
                {context.userRank.length > 0
                  ? context.userRank[0].tier + ' ' + context.userRank[0].rank
                  : 'UNRANKED'}
              </span>
            </UsernameRank>
            {context.userRank.length > 0 && (
              <Emblem
                src={`${process.env.PUBLIC_URL}/emblems/${context.userRank[0].tier}.png`}
                alt={context.userRank[0].tier}
              />
            )}
          </UserInfo>
          <Results />
        </Container>
      );
    }
  }
};

export default User;
