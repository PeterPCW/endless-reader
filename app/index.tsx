// /app/screens/index.tsx
import React from 'react';
import { RootLayout } from '@/app/screens/_layout';
import { LevelProvider } from '@/app/context/LevelProvider';

export default function App() {
  return (
    <LevelProvider>
      <RootLayout />
    </LevelProvider>
  );
}
