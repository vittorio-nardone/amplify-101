import { useElapsedTime } from 'use-elapsed-time'

const TimeCounter = () => {
  const isPlaying = true
  const { elapsedTime } = useElapsedTime(isPlaying)

  return elapsedTime.toFixed(2)
}

export default TimeCounter;