import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';

import { UserContext } from '../context/UserContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Label = styled.label`
  position: absolute;
  display: inline-block;
  font-size: 1.5em;
  left: 0;
  transition: 0.3s;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 5px;
  padding-right: 3px;
  background-color: white;
  pointer-events: none;
`;

const Input = styled.input`
  position: relative;
  font-size: 1.5em;
  width: 500px;
  padding-top: 10px;
  border-radius: 0;
  border-color: black;

  &:focus {
    outline: none;
  }

  &:focus ~ ${Label}, &:valid ~ ${Label} {
    top: -30%;
    font-size: 1.3em;
  }
`;

const Button = styled.button`
  position: absolute;
  border: none;
  background-color: #03f8fc;
  height: 100%;
  padding: 0 15px 0 15px;
  border: solid black 2px;
  border-left: none;
`;

function Search() {
  const context = useContext(UserContext);
  const history = useHistory();
  const [user, setUser] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    context.searchUser(user);
    history.push(`/user/${user}`);
  };

  const onChange = (e) => {
    e.preventDefault();
    setUser(e.target.value);
  };

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <InputContainer>
          <Input
            onChange={onChange}
            type='text'
            required='required'
            name='name'
            className='form-control'
          />
          <Label>Enter username</Label>
          <Button type='submit'>Submit</Button>
        </InputContainer>
      </form>
    </Container>
  );
}

export default Search;
