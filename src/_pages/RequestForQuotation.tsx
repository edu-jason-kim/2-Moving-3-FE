'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMovesDetailData, getUserMoveInfoId, patchMove, postMove } from '@/api/MovesService';
import AddressCard from '@/components/cards/AddressCard';
import CalendarCard from '@/components/cards/CalendarCard';
import MovingTypeCheckCard from '@/components/cards/MovingTypeCheckCard';
import Empty from '@/components/common/Empty/Empty';
import { movingTypeLabelMap } from '@/constants/movingTypeCheckCard';
import { MoveData } from '@/interfaces/Page/RequestForQuotationInterface';
import { setMoveInfoId } from '@/store/slices/SignInSlice';
import { RootState } from '@/store/store';
import { formatDate } from '@/utils/Format';

export default function RequestForQuotation() {
  const [moveData, setMoveData] = useState<MoveData>({} as MoveData);
  const [movingType, setMovingType] = useState('');
  const [isMovingType, setIsMovingType] = useState(false);
  const [movingDate, setMovingDate] = useState<Date>(new Date());
  const [isMovingDate, setIsMovingDate] = useState(false);
  const [regions, setRegions] = useState<{
    start: string;
    arrival: string;
  }>({
    start: '',
    arrival: '',
  });
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const edit = searchParams.get('edit') === 'true';
  const moveInfoId = useSelector((state: RootState) => state.signIn.moveInfoId);

  useEffect(() => {
    const fetchCheckAPi = async () => {
      if (moveInfoId) {
        try {
          const res: MoveData = await getMovesDetailData(moveInfoId);
          setMoveData(res);

          if (edit && Object.keys(res).length > 0) {
            setMovingType(res.serviceType);
            setMovingDate(new Date(res.date));
            setIsMovingDate(!!new Date(res.date));
            setIsMovingType(!!res.serviceType);
            setRegions({
              start: res.fromAddress,
              arrival: res.toAddress,
            });
          }
        } catch (err) {
          console.error('Get move check: ', err);
          router.push('/not-found');
        }
      }
    };
    fetchCheckAPi();
  }, [moveInfoId, edit]);

  useEffect(() => {
    if (type && !movingType) {
      setMovingType(type);
      setIsMovingType(true);
    }
  }, [type]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const isMobileOrTablet = windowWidth < 1200;
  const baseWidth = isMobileOrTablet ? '100%' : '120rem';
  let progressWidth;

  if (!isMovingType) {
    progressWidth = isMobileOrTablet ? `calc(${baseWidth} * 1 / 4)` : '35rem';
  } else if (!isMovingDate) {
    progressWidth = `calc(${baseWidth} * 2 / 4)`;
  } else if (!(regions.start && regions.arrival)) {
    progressWidth = `calc(${baseWidth} * 3 / 4)`;
  } else {
    progressWidth = baseWidth;
  }

  const formattedDate = movingDate ? formatDate(movingDate) : '';

  const quotationMutation = useMutation({
    mutationFn: async () => {
      await postMove(movingType, movingDate.toISOString(), regions.start, regions.arrival);
      const moveInfoId = await getUserMoveInfoId();
      dispatch(setMoveInfoId(moveInfoId.id));
    },
    onSuccess: () => {
      alert('견적 요청이 완료됐습니다!');
      router.push('/normal/my-quote/edit');
    },
    onError: () => {
      alert('견적 요청에 실패했습니다. 다시 한 번 시도해주세요!');
      router.push('/not-found');
    },
  });

  const editQuotationMutation = useMutation({
    mutationFn: async () => {
      await patchMove(moveData.id, movingType, movingDate.toISOString(), regions.start, regions.arrival);
    },
    onSuccess: () => {
      alert('견적 수정이 완료됐습니다!');
      router.push('/normal/my-quote/edit');
    },
    onError: () => {
      alert('견적 수정에 실패했습니다. 다시 한 번 시도해주세요!');
      router.push('/not-found');
    },
  });

  const handleQuotationSubmit = () => {
    quotationMutation.mutate();
  };

  const handleEditQuotationSubmit = () => {
    editQuotationMutation.mutate();
  };

  return (
    <>
      {Object.keys(moveData).length > 0 && !edit ? (
        <div className="w-full h-screen flex flex-col bg-background-200">
          <div className="bg-white dark:bg-dark-p lg:px-[26rem] lg:py-[3.2rem] md:px-[7.2rem] md:py-[2.4rem] sm:px-[2.4rem] sm:py-[2.4rem] flex flex-col gap-[2.4rem] ">
            <h1 className="text-[2.4rem] font-semibold text-[#2B2B2B] dark:text-dark-t">견적요청</h1>
          </div>
          <div className="w-full h-full bg-background-200 dark:bg-dark-bg lg:pt-[19.4rem] md:pt-[12.7rem] sm:pt-[12.7rem] flex justify-center">
            <Empty type="RequestQuote" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <div className="bg-white dark:bg-dark-p w-full md:px-[5rem] sm:px-[2rem] lg:py-[3.2rem] md:py-[2.4rem] sm:py-[2.4rem] flex flex-col items-center gap-[2.4rem] ">
            <div className="lg:w-[120rem] md:w-full sm:w-full">
              <h1 className="text-[2.4rem] font-semibold text-[#2B2B2B] dark:text-dark-t">
                {edit ? '이사정보 수정' : '이사정보 등록'}
              </h1>
            </div>
            <div className="lg:w-[120rem] md:w-full sm:w-full lg:h-[0.8rem] md:h-[0.6rem] sm:h-[0.6rem] rounded-[3rem] bg-line-200">
              <div
                className="lg:h-[0.8rem] md:h-[0.7rem] sm:h-[0.6rem] rounded-[3rem] bg-blue-300"
                style={{ width: progressWidth }}
              ></div>
            </div>
          </div>
          <div className=" w-screen h-screen bg-background-200 dark:bg-dark-bg lg:pt-[4rem] md:pt-[0.8rem] sm:pt-[0.8rem] flex justify-center">
            <div className="lg:overflow-y-auto w-full lg:px-[2rem] md:px-[5rem] sm:px-[2rem] md:overflow-y-auto sm:overflow-y-hidden overflow-x-hidden lg:h-[calc(100vh-5rem)] lg:pr-[2rem] md:pr-0 sm:pr-0 flex flex-col items-center lg:gap-y-[2.4rem] md:gap-y-[0.8rem] sm:gap-y-[0.6rem]">
              <div className="lg:w-[120rem] md:w-full sm:w-full flex flex-col lg:gap-[2.4rem] md:gap-[0.8rem] sm:gap-[0.8rem]">
                <div className="lg:max-w-[52rem] md:max-w-[24.8rem] sm:max-w-[24.8rem] rounded-[3rem] rounded-tl-none lg:px-[4rem] lg:py-[2rem] md:px-[2rem] md:py-[1.2rem] sm:px-[2rem] sm:py-[0.6rem] bg-white dark:bg-dark-p border-none lg:text-[1.8rem] md:text-[1.4rem] sm:text-[1.4rem] font-medium text-black-400 dark:text-dark-t">
                  몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
                </div>
                <div className="lg:max-w-[27rem] md:max-w-[19rem] sm:max-w-[19rem] rounded-[3rem] rounded-tl-none lg:px-[4rem] lg:py-[2rem] md:px-[2rem] md:py-[1.2rem] sm:px-[2rem] sm:py-[1.2rem] bg-white dark:bg-dark-p border-none lg:text-[1.8rem] md:text-[1.4rem] sm:text-[1.4rem] font-medium text-black-400 dark:text-dark-t">
                  이사 종류를 선택해 주세요.
                </div>
              </div>
              <div className="lg:w-[120rem] md:w-full sm:w-full flex justify-end lg:px-0 md:px-[5rem] sm:px-[2rem]">
                {!isMovingType ? (
                  <div>
                    <MovingTypeCheckCard
                      setMovingType={setMovingType}
                      setIsMovingType={setIsMovingType}
                      initialMovingType={movingType}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-[0.6rem]">
                    <div className="lg:max-w-[32.9rem] md:max-w-[23.4rem] sm:max-w-[23.4rem] rounded-[3rem] rounded-tr-none lg:px-[4rem] lg:py-[2rem] md:px-[2rem] md:py-[1.2rem] sm:px-[2rem] sm:py-[1.2rem] bg-blue-300 border-none lg:text-[1.8rem] md:text-[1.4rem] sm:text-[1.4rem] font-medium text-white ">
                      {movingTypeLabelMap[movingType]}
                    </div>
                    <div
                      className="cursor-pointer lg:text-[1.6rem] md:text-[1.2rem] sm:text-[1.2rem] font-medium text-gray-500 self-end underline"
                      onClick={() => setIsMovingType(false)}
                    >
                      수정하기
                    </div>
                  </div>
                )}
              </div>

              {isMovingType && (
                <div className="lg:w-[120rem] md:w-full sm:w-full ">
                  <div className="lg:max-w-[29rem] md:max-w-[20rem] sm:max-w-[20rem] rounded-[3rem] rounded-tl-none lg:px-[4rem] lg:py-[2rem] md:px-[2rem] md:py-[1.2rem] sm:px-[2rem] sm:py-[1.2rem] bg-white dark:bg-dark-p border-none lg:text-[1.8rem] md:text-[1.4rem] sm:text-[1.4rem] font-medium text-black-400 dark:text-dark-t">
                    이사 예정일을 선택해 주세요.
                  </div>
                </div>
              )}

              <div className="lg:w-[120rem] md:w-full sm:w-full flex justify-end ">
                {!isMovingDate
                  ? isMovingType && (
                      <div className="mb-[10rem] lg:px-0 md:px-[5rem] sm:px-[2rem]">
                        <CalendarCard
                          setMovingDate={setMovingDate}
                          setIsMovingDate={setIsMovingDate}
                          initialMovingDate={movingDate}
                        />
                      </div>
                    )
                  : isMovingType && (
                      <div className="flex flex-col gap-[0.6rem] lg:px-0 md:px-[5rem] sm:px-[2rem]">
                        <div className="lg:max-w-[32.9rem] md:max-w-[28rem] sm:max-w-[28rem] rounded-[3rem] rounded-tr-none lg:px-[4rem] lg:py-[2rem] md:px-[2rem] md:py-[1.2rem] sm:px-[2rem] sm:py-[1.2rem] bg-blue-300 border-none lg:text-[1.8rem] md:text-[1.4rem] sm:text-[1.4rem] font-medium text-white ">
                          {formattedDate}
                        </div>
                        <div
                          className="cursor-pointer lg:text-[1.6rem] md:text-[1.2rem] sm:text-[1.2rem] font-medium text-gray-500 self-end underline"
                          onClick={() => setIsMovingDate(false)}
                        >
                          수정하기
                        </div>
                      </div>
                    )}
              </div>

              {isMovingType && isMovingDate && (
                <div className="lg:w-[120rem] md:w-full sm:w-full">
                  <div className="lg:max-w-[29rem] md:max-w-[19rem] sm:max-w-[19rem] rounded-[3rem] rounded-tl-none lg:px-[4rem] lg:py-[2rem] md:px-[2rem] md:py-[1.2rem] sm:px-[2rem] sm:py-[1.2rem] bg-white dark:bg-dark-p border-none lg:text-[1.8rem] md:text-[1.4rem] sm:text-[1.4rem] font-medium text-black-400 dark:text-dark-t self-start">
                    이사 지역을 선택해 주세요.
                  </div>
                </div>
              )}
              <div className="lg:w-[120rem] md:w-full sm:w-full flex justify-end">
                {isMovingType && isMovingDate && (
                  <div className="self-end mb-[10rem] lg:px-0 md:px-[5rem] sm:px-[2rem]">
                    <AddressCard
                      regions={regions}
                      setRegions={setRegions}
                      handleSubmit={edit ? handleEditQuotationSubmit : handleQuotationSubmit}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
