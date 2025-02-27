import React, { useRef, useEffect } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Canvas as SkiaCanvas, Rect, useValue, runTiming } from '@shopify/react-native-skia';

interface Props {
  width: number;
  height: number;
  onCollision: () => void;
  onClear: () => void;
}

export const Canvas = ({ width, height, onCollision, onClear }: Props) => {
  const playerY = useValue(height - 50); // Player's vertical position
  const obstacles = useRef<{ x: number; width: number; height: number; cleared?: boolean }[]>([]);
  const animationFrame = useRef(0);
  const score = useRef(0);
  const isJumping = useRef(false);

  const jump = () => {
    if (isJumping.current) return;

    isJumping.current = true;
    const jumpHeight = 150;
    const jumpDuration = 500;

    // Jump up
    runTiming(playerY, height - 50 - jumpHeight, {
      duration: jumpDuration / 2,
    }, () => {
      // Fall down
      runTiming(playerY, height - 50, {
        duration: jumpDuration / 2,
      }, () => {
        isJumping.current = false;
      });
    });
  };

  useEffect(() => {
    let lastObstacleTime = Date.now();

    const update = () => {
      // Move obstacles
      obstacles.current = obstacles.current
        .map(obs => ({
          ...obs,
          x: obs.x - 5 // Move left
        }))
        .filter(obs => obs.x > -obs.width); // Remove off-screen obstacles

      // Add new obstacles
      const now = Date.now();
      if (now - lastObstacleTime > 2000) { // Add obstacle every 2 seconds
        obstacles.current.push({
          x: width,
          width: 30,
          height: Math.random() * 50 + 50 // Random height between 50-100
        });
        lastObstacleTime = now;
      }

      // Check collisions
      const playerRect = {
        x: 50,
        y: playerY.current,
        width: 30,
        height: 30
      };

      obstacles.current.forEach(obs => {
        const collision = 
          obs.x < playerRect.x + playerRect.width &&
          obs.x + obs.width > playerRect.x &&
          height - obs.height < playerRect.y + playerRect.height;

        if (collision) {
          onCollision();
          cancelAnimationFrame(animationFrame.current);
          return;
        }

        // Score point when clearing obstacle
        if (obs.x + obs.width < playerRect.x && !obs.cleared) {
          obs.cleared = true;
          score.current++;
          onClear();
        }
      });

      animationFrame.current = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrame.current);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View>
        <SkiaCanvas style={{ width, height }}>
          {/* Draw player */}
          <Rect 
            x={50} 
            y={playerY} 
            width={30} 
            height={30} 
            color="#6366f1" 
          />

          {/* Draw obstacles */}
          {obstacles.current.map((obs, i) => (
            <Rect 
              key={i}
              x={obs.x}
              y={height - obs.height}
              width={obs.width}
              height={obs.height}
              color="#ef4444"
            />
          ))}
        </SkiaCanvas>
      </View>
    </TouchableWithoutFeedback>
  );
};