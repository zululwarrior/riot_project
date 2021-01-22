import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { GlobalStyles } from './global';
import Banner from './components/Banner';
import { MasteryProvider } from './context/MasteryContext';
import { UserProvider } from './context/UserContext';
import { MatchHistoryProvider } from './context/MatchHistoryContext';
import Home from './pages/Home';
import Result from './pages/Result';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`;

function App() {
  return (
    <UserProvider>
      <MatchHistoryProvider>
        <MasteryProvider>
          <GlobalStyles />
          <Router>
            <Container>
              <Banner />
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/user/:username' component={Result} />
              </Switch>
            </Container>
          </Router>
        </MasteryProvider>
      </MatchHistoryProvider>
    </UserProvider>
  );
}

export default App;
