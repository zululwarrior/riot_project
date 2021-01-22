import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
`;

const Text = styled.div`
  margin-left: 10px;
`;

const Champ = (props) => {
  const { champ } = props;
  return (
    <Container>
      <Image
        src={`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/champion/${champ.name}.png`}
        alt={champ.name}
      />
      <Text>
        Mastery points:
        {champ.points}
      </Text>
    </Container>
  );
};

export default Champ;
