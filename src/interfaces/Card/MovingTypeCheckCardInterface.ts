import type { Dispatch, SetStateAction } from 'react';

export interface MovingTypeCheckType {
  type: string;
  code: string;
}

export interface MovingTypeCheckCardProps {
  setMovingType: Dispatch<SetStateAction<string>>;
  setIsMovingType: Dispatch<SetStateAction<boolean>>;
  initialMovingType: string;
}
