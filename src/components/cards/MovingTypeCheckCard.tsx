'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import check from '@/../public/assets/rfq/ellipse_active.svg';
import noCheck from '@/../public/assets/rfq/ellipse_inactive.svg';
import movingTypesCheck from '@/constants/movingTypeCheckCard';
import type { MovingTypeCheckCardProps } from '@/interfaces/Card/MovingTypeCheckCardInterface';
import { ButtonWrapper } from '../common/headless/Button';

export default function MovingTypeCheckCard({ setMovingType, setIsMovingType, initialMovingType }: MovingTypeCheckCardProps) {
  const [selectedMovingType, setSelectedMovingType] = useState<string>(initialMovingType);

  useEffect(() => {
    if (initialMovingType) {
      setSelectedMovingType(initialMovingType);

      const matchingType = movingTypesCheck.find(movingType => movingType.code === initialMovingType);
      if (matchingType) {
        setIsMovingType(prev => !prev);
      }
    }
  }, [initialMovingType, setIsMovingType]);

  const handleCheckClick = (movingType: string) => {
    setSelectedMovingType(movingType);
  };

  const handleCompleteClick = () => {
    if (selectedMovingType) {
      setMovingType(selectedMovingType);
      setIsMovingType(true);
    }
  };

  return (
    <div className="lg:w-[64rem] lg:h-[45.2rem] md:w-[31.2rem] md:h-[27.4rem] sm:w-[31.2rem] sm:h-[27.4rem] rounded-[2.4rem] rounded-tr-[0.4rem] border-none lg:p-[4rem] md:p-[1.6rem] sm:p-[1.6rem] cursor-pointer bg-white dark:bg-dark-p shadow-custom5 dark:shadow">
      {movingTypesCheck.map(movingType => (
        <div
          key={movingType.type}
          onClick={() => {
            handleCheckClick(movingType.code);
          }}
          className={`flex items-center lg:w-[56rem] lg:h-[8.4rem] md:w-[28rem] md:h-[5.2rem] sm:w-[28rem] sm:h-[5.2rem] rounded-[1.6rem] lg:px-[2.4rem] lg:py-[3.2rem] md:px-[1.6rem] md:py-[1.4rem] sm:px-[1.6rem] sm:py-[1.4rem] gap-[0.8rem] lg:mb-[1.6rem] md:mb-[0.8rem] sm:mb-[0.8rem] ${
            selectedMovingType === movingType.code
              ? 'border-blue-300 bg-blue-50 dark:bg-dark-bg border'
              : 'bg-white dark:bg-dark-p border-line-200 border'
          }`}
        >
          <div className="lg:w-[3.6rem] lg:h-[3.6rem] md:w-[2.4rem] md:h-[2.4rem] sm:w-[2.4rem] sm:h-[2.4rem] relative cursor-pointer">
            <Image src={selectedMovingType === movingType.code ? check : noCheck} alt="체크" fill />
          </div>
          <span className="lg:text-[1.8rem] md:text-[1.4rem] sm:text-[1.4rem] font-semibold text-black-400 dark:text-dark-t">
            {movingType.type}
          </span>
        </div>
      ))}
      <ButtonWrapper id="moving-check-button">
        <ButtonWrapper.Button
          disabled={!selectedMovingType}
          onClick={handleCompleteClick}
          className="lg:w-[56rem] lg:h-[6.4rem] md:w-[28rem] md:h-[5.4rem] sm:w-[28rem] sm:h-[5.4rem] rounded-[1.6rem] p-[1.6rem] bg-blue-300 text-center lg:text-[2rem] md:text-[1.6rem] sm:text-[1.6rem] font-semibold text-white"
        >
          선택완료
        </ButtonWrapper.Button>
      </ButtonWrapper>
    </div>
  );
}
