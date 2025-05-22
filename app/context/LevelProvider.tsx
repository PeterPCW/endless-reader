import React, { useState } from 'react';
import { LevelContext } from '@/app/screens/Levels';
import { LevelData, LevelMetaData, levels } from '@/app/assets/data/levels';

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);

  const setLevel = (meta: LevelMetaData) => {
    const fullData = levels[meta.id];
    setSelectedLevel(fullData ? { ...meta, ...fullData } : null);
  };

  return (
    <LevelContext.Provider value={{ 
      selectedLevel, 
      setSelectedLevel: setLevel 
    }}>
      {children}
    </LevelContext.Provider>
  );
};
