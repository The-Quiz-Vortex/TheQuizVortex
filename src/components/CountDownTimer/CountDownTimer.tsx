import ExpiredNotice from '../ExpiredNotice/ExpiredNotice.tsx';
import ShowCounter from '../ShowCounter/ShowCounter.tsx';
import { useCountdown } from './countDownTimer.helper.ts';

const CountDownTimer = ({ targetDate, setQuizFinished, quizFinished }) => {

    const [days, hours, minutes, seconds] = useCountdown(targetDate);
    
    if (days + hours + minutes + seconds <= 0) {
        if (!quizFinished) {            
            setQuizFinished(true);
            return <ExpiredNotice />;
        }
    } else {
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
export default CountDownTimer;