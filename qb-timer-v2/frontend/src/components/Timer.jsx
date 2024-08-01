import PropTypes from "prop-types";

function Timer({
  minutes,
  seconds,
  label,
  isActive = false,
  idleStyle = "text-slate-400",
  activeStyle,
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1
        className={`text-[1.3rem] md:text-[1.5rem] lg:text-[2rem] xl:text-[3rem] font-bold ${
          !isActive ? idleStyle : activeStyle
        }`}
      >
        {label}
      </h1>
      <h2
        className={`text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[18rem] font-bold ${
          !isActive ? idleStyle : activeStyle
        }`}
      >
        {minutes}:{String(seconds).padStart(2, "0")}
      </h2>
    </div>
  );
}

Timer.propTypes = {
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  idleStyle: PropTypes.string.isRequired,
  activeStyle: PropTypes.string,
};

export default Timer;
