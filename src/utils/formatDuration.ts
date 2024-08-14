export default function (duration: string): string {
  
  const match = duration.match(/^P(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?)?$/);

  if (!match) {
    throw new Error('Invalid duration format');
  }

  const days = match[1] ? parseInt(match[1], 10) : 0;
  const hours = match[2] ? parseInt(match[2], 10) : 0;
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  const seconds = match[4] ? parseInt(match[4], 10) : 0;

  // Convert the duration to total seconds
  const totalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;

  // Calculate days, hours, minutes, and remaining seconds
  const daysResult = Math.floor(totalSeconds / (24 * 3600));
  const remainingSeconds = totalSeconds % (24 * 3600);
  const hoursResult = Math.floor(remainingSeconds / 3600);
  const minutesResult = Math.floor((remainingSeconds % 3600) / 60);
  const secondsResult = remainingSeconds % 60;

  // Construct the formatted duration
  let formattedDuration = '';
  if (daysResult > 0) {
    formattedDuration += `${daysResult}:`;
  }
  if(hoursResult>0||daysResult>0){
    formattedDuration += `${hoursResult.toString().padStart(2, '0')}:`;
  }
  formattedDuration += `${minutesResult.toString().padStart(2, '0')}:${secondsResult.toString().padStart(2, '0')}`;


  if(daysResult === 0 && hoursResult === 0 && minutesResult === 0 && secondsResult === 0) return "LIVE";

  return formattedDuration;
}