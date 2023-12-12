import ExpiredNotice from '../ExpiredNotice/ExpiredNotice.tsx';
import ShowCounter from '../ShowCounter/ShowCounter.tsx';
import { useCountdown } from './countDownTimer.helper.ts';

interface CountDownTimerProps {
    targetDate: number;
    setQuizFinished: React.Dispatch<React.SetStateAction<boolean>>;
    quizFinished: boolean;
}

const CountDownTimer = ({ targetDate, setQuizFinished, quizFinished }: CountDownTimerProps) => {

    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        if (!quizFinished) {
            setQuizFinished(true);
            return <ExpiredNotice />;
        }
    } else {
        if (!quizFinished) {
            return (
                <ShowCounter
                    days={days}
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                />
            );
        }
    }
}
export default CountDownTimer;