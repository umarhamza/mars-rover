import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import grid from './assets/grid-red.png';
import compassImg from './assets/compass.png';
import roverImg from './assets/rover.png';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Compass = styled.div`
  position: absolute;
  top: 0;
  right: -130px;
  width: 120px;
  height: 120px;
  background-color: #fff;
  border: 4px solid #751900;
  border-radius: 100%;

  img {
    max-width: 100%;
    display: block;
    transform: rotate(${(props) => -props.rotation}deg);
    transition: all 0.3s linear;
  }
`;

const Grid = styled.div`
  width: 500px;
  height: 500px;
  position: relative;
  // background: url(${grid}) no-repeat center;
  background-size: contain;
  margin-bottom: 40px;
`;

const Rover = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  transform: rotate(${(props) => props.rotation}deg);

  img {
    max-width: 100%;
  }
`;

const Form = styled.form`
  border: 4px solid #751900;
  display: block;
  width: 100%;
  max-width: 500px;
  padding: 20px;
  color: darkred;
  background: #fff;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 20px 0;
  color: inherit;
  line-height: 1;
  font-weight: bold;
`;

const FormTitle = styled.h3`
  font-size: 20px;
  margin: 0;
`;

const DirectionEntered = styled.p`
  height: 18px;
  font-size: 18px;
  line-height: 1;
  margin: 0;
`;

const Input = styled.input`
  color: #f2d7d7;
  font-size: 20px;
  line-height: 20px;
  text-transform: uppercase;
  outline: 0;
  border: none;
  background-color: #751900;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
`;

const directions = {
  L: 'Left',
  R: 'Right',
  F: 'Forward',
  B: 'Backwards',
};

function App() {
  const [coord, setCoord] = useState({ left: 200, top: 250 });
  const [rotation, setRotation] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [message, setMessage] = useState('');
  const allowedChars = /[L R F]/g;
  const inputField = useRef(null);

  useEffect(() => {
    inputField.current.focus();
  }, []);

  const handleChange = ({ target: { value } }) => {
    value = value.toUpperCase();
    const isMovingForward = value === 'F';

    if (!allowedChars.test(value)) {
      return false;
    }

    setInputVal(value);
    setMessage(
      `${isMovingForward ? 'Moving' : 'Turning'} ${directions[value]}...`
    );

    if (isMovingForward) {
      moveRover();
    } else {
      rotateRover(value);
    }

    setTimeout(() => {
      setInputVal('');
      setMessage('');
      inputField.current.focus();
    }, 500);
  };

  const moveRover = () => {
    const moveForward = rotation === 0;
    const moveRight = rotation === 90 || rotation === -270;
    const moveLeft = rotation === -90 || rotation === 270;
    const moveBackward = rotation === -180 || rotation === 180;

    if (isOutOfBounds(moveForward, moveRight, moveBackward, moveLeft))
      return false;

    let newYPos = coord.top;
    let newXPos = coord.left;

    if (moveForward) {
      newYPos = newYPos - 50;
    } else if (moveRight) {
      newXPos = newXPos + 50;
    } else if (moveLeft) {
      newXPos = newXPos - 50;
    } else {
      // Move backward
      newYPos = newYPos + 50;
    }

    setCoord((prevState) => ({
      ...prevState,
      top: newYPos,
      left: newXPos,
    }));
  };

  const isOutOfBounds = (moveForward, moveRight, moveBackward, moveLeft) => {
    if (moveForward && coord.top === 0) {
      return true;
    } else if (moveRight && coord.left === 450) {
      return true;
    } else if (moveLeft && coord.left === 0) {
      return true;
    } else if (moveBackward && coord.top === 450) {
      return true;
    }
  };

  const rotateRover = (dir) => {
    setRotation((prevRotation) => {
      if (dir === 'L') {
        return prevRotation >= -180 ? prevRotation - 90 : 0;
      } else {
        return prevRotation <= 180 ? prevRotation + 90 : 0;
      }
    });
  };

  return (
    <Container onClick={() => inputField.current.focus()}>
      <Grid>
        <Compass rotation={rotation}>
          <img src={compassImg} alt='compass' />
        </Compass>
        <Rover left={coord.left} top={coord.top} rotation={rotation}>
          <img src={roverImg} alt='rover' />
        </Rover>
      </Grid>
      <Form>
        <FormHeader>
          <FormTitle>Coordinates:</FormTitle>
          <DirectionEntered>
            {message !== '' ? message : 'Enter L, R or F'}
          </DirectionEntered>
        </FormHeader>
        <Input
          type='text'
          ref={inputField}
          value={inputVal}
          disabled={inputVal !== ''}
          onChange={handleChange}
        />
        <div>Left: {coord.left}</div>
        <div>Right: {coord.top}</div>
        <div>Rotation: {rotation}</div>
      </Form>
    </Container>
  );
}

export default App;
