import React from 'react';
import styled from 'styled-components';

import Champs from './Champs';
import MatchHistories from './MatchHistories';

const Container = styled.div`
  display: flex;
  width: 80%;
`;

const Results = () => {
  return (
    <Container>
      <MatchHistories />
    </Container>
  );
};

export default Results;
