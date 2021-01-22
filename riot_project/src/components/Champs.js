import React, { useContext, useEffect } from 'react';
import Champ from './Champ';
import styled from 'styled-components';

import { MasteryContext } from '../context/MasteryContext';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  width: 50%;
  align-self: center;
`;

const Champs = () => {
  const context = useContext(MasteryContext);

  useEffect(() => {
    context.getChamps();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    context.loadMore();
  };

  if (context.champs) {
    return (
      <Container>
        <div className='champs'>
          {context.champs.map((champ) => {
            return <Champ key={champ.id} champ={champ} />;
          })}
        </div>
        <Button onClick={handleClick}>Load More</Button>
      </Container>
    );
  } else {
    return <div>Champs</div>;
  }
};
export default Champs;
