import level1 from './level1.json';
import level2 from './level2.json';
import level3 from './level3.json';

export interface WordType {
  word: string;
  syllables: number;
  parts: string[];
  voiced: string[];
  length: string[];
  source: string[];
}

export interface LevelData extends LevelMetaData {
  words: WordType[];
  sentences: string[];
}

export const levels: Record<string, LevelData> = {
  '1': level1 as LevelData,
  '2': level2 as LevelData,
  '3': level3 as LevelData,
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
    ,
    {
      id: "3",
      name: "Level 3",
      thumbnail: "@/app/assets/images/level3_thumbnail.png",
      completeVideo: "@app/assets/videos/level3_complete.mp4"
    }
  ]
};
