import React, { useState, useRef } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Import sound files (place them in the public folder)
const spinSound = './spin-sound.mp3'; // Add your spin sound file
const winSound = './win-sound.mp3'; // Add your win sound file

const discounts = [
  { value: 10, text: '10% OFF' },
  { value: 20, text: '20% OFF' },
  { value: 30, text: '30% OFF' },
  { value: 40, text: '40% OFF' },
  { value: 50, text: '50% OFF' },
  { value: 60, text: '60% OFF' },
  { value: 70, text: '70% OFF' },
  { value: 80, text: '80% OFF' },
  { value: 90, text: '90% OFF' },
  { value: 100, text: 'GOLD' }, // Custom text for the gold segment
];

const colors = [
  '#FF6B6B', '#FFD166', '#45B8AC', '#4ECDC4', '#556270',
  '#C7F464', '#FF6B6B', '#FFD166', '#45B8AC', '#FFD700' // Gold color
];

// Styled components
const WheelContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '2rem',
  position: 'relative',
});

const Wheel = styled('div')(({ spinning, rotation }) => ({
  position: 'relative',
  width: '320px',
  height: '320px',
  borderRadius: '50%',
  border: '10px solid #2c3e50',
  overflow: 'hidden',
  transition: spinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
  transform: `rotate(${rotation}deg)`,
  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
}));

const Segment = styled('div')(({ rotate, color }) => ({
  position: 'absolute',
  width: '50%',
  height: '50%',
  right: '0',
  transformOrigin: '0% 100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: `rotate(${rotate}deg)`,
  backgroundColor: color,
  border: '1px solid rgba(255,255,255,0.3)',
}));

const CenterPointer = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70px',
  height: '70px',
  backgroundColor: '#ffd700',
  borderRadius: '50%',
  zIndex: 3,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '20px solid transparent',
    borderRight: '20px solid transparent',
    borderBottom: '30px solid #ffd700',
  },
});

const SpinButton = styled(Button)({
  marginTop: '2rem',
  fontSize: '1.5rem',
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '16px 40px',
  borderRadius: '50px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  boxShadow: '0 4px 15px rgba(76,175,80,0.3)',
  '&:hover': {
    backgroundColor: '#45a049',
    transform: 'scale(1.05)',
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
  },
});

const Title = styled(Typography)({
  fontSize: '3rem',
  fontWeight: 'bold',
  color : '#2c3e50',
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
  letterSpacing: '4px',
  fontFamily: '"Arial Black", sans-serif',
});

const Subtitle = styled(Typography)({
  fontSize: '2rem',
  color: '#4CAF50',
  marginBottom: '2rem',
  fontWeight: 600,
  fontFamily: '"Arial", sans-serif',
});

const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);

  const spinAudioRef = useRef(new Audio(spinSound));
  const winAudioRef = useRef(new Audio(winSound));

  const getRandomDegree = () => {
    const segmentDegree = 360 / discounts.length; // 36 degrees per segment
    const extraRotations = 5 * 360; // 5 full extra rotations
    const randomSegment = Math.floor(Math.random() * discounts.length);
    return extraRotations + (randomSegment * segmentDegree);
  };

  const handleSpin = () => {
    if (!spinning) {
      setSpinning(true);
      const newRotation = rotation + getRandomDegree();
      setRotation(newRotation);

      // Play spin sound
      spinAudioRef.current.play();

      setTimeout(() => {
        const finalDegree = newRotation % 360;
        const resultIndex = Math.floor((360 - finalDegree) / (360 / discounts.length)) % discounts.length;
        setResult(discounts[resultIndex]);
        setSpinning(false);

        // Play win sound
        winAudioRef.current.play();
      }, 5000);
    }
  };

  return (
    <WheelContainer>
      <Title variant="h2">LUCKY WHEEL</Title>
      
      <div style={{ position: 'relative' }}>
        <CenterPointer>
          <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>
            SPIN
          </Typography>
        </CenterPointer>
        <Wheel spinning={spinning} rotation={rotation}>
          {discounts.map((discount, index) => {
            const rotate = index * 36; // Equal partitions (360/10 = 36 degrees per segment)
            return (
              <Segment key={index} rotate={rotate} color={colors[index]}>
                <Typography variant="body1" sx={{ 
                  transform: 'rotate(-45deg)', 
                  fontWeight: 'bold', 
                  color: index === 9 ? '#2c3e50' : '#ffffff', // White text for better contrast
                  fontSize: '1.5rem', // Larger font size
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)', // Add shadow for better readability
                }}>
                  {discount.text} {/* Use the custom text */}
                </Typography>
              </Segment>
            );
          })}
        </Wheel>
      </div>

      <SpinButton variant="contained" onClick={handleSpin} disabled={spinning}>
        {spinning ? 'Spinning...' : 'TAP TO SPIN'}
      </SpinButton>

      {result && <Typography sx={{ mt: 3, fontSize: '1.8rem', color: '#2c3e50' }}>
        You won: {result.value}% discount! 🎉 {/* Use the value property */}
      </Typography>}

      {/* Audio elements for sound effects */}
      <audio ref={spinAudioRef} src={spinSound} />
      <audio ref={winAudioRef} src={winSound} />
    </WheelContainer>
  );
};

export default SpinWheel;