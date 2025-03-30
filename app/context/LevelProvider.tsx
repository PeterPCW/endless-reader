import React, { useState } from 'react';
import { LevelContext } from '@/app/screens/Levels';
import { LevelMetaData } from '@/app/assets/data/levels';

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelMetaData | null>(null);

  return (
    <LevelContext.Provider value={{ selectedLevel, setSelectedLevel }}>
      {children}
    </LevelContext.Provider>
  );
};
