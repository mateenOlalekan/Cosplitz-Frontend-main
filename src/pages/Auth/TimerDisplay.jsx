function TimerDisplay({ onResend, timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center">
      {timeLeft > 0 ? (
        <p className="text-gray-600 text-sm mt-3">
          Resend available in{" "}
          <span className="text-green-600 font-semibold">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </p>
      ) : (
        <button
          onClick={onResend}
          className="text-green-600 font-semibold text-sm mt-3 hover:underline"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
}

export default TimerDisplay;