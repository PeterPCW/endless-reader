import level1 from './level1.json';
import level2 from './level2.json';

export interface WordType {
  word: string;
  parts: string[];
  voiced: string[];
}

export interface LevelData {
  id: string;
  words: WordType[];
  sentences: string[];
}

export const levels: Record<string, LevelData> = {
  '1': level1 as LevelData,
  '2': level2 as LevelData,
};

export interface LevelMetaData {
  id: string;
  name: string;
  thumbnail: string;
  completeVideo: string;
}

export const levelsData: { levels: LevelMetaData[] } = {
  levels: [
    {
      id: "1",
      name: "Level 1",
      thumbnail: "@/app/assets/images/level1_thumbnail.png",
      completeVideo: "@app/assets/videos/level1_complete.mp4"
    },
    {
      id: "2",
      name: "Level 2",
      thumbnail: "@/app/assets/images/level2_thumbnail.png",
      completeVideo: "@app/assets/videos/level2_complete.mp4"
    }
  ]
};
