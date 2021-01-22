import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: black;
  color: white;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;
const Anchor = styled.a`
  &:visited,
  &:link,
  &:visited,
  &:hover,
  &:active {
    color: white;
    text-decoration: none;
  }
`;
const Banner = () => {
  return (
    <Container>
      <h1>
        <Anchor href='/'>RIOT GAMES API</Anchor>
      </h1>
    </Container>
  );
};

export default Banner;
