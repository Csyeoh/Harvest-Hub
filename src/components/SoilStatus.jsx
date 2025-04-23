// import React from 'react';
// import { FaTint, FaAtom } from 'react-icons/fa';
// import useSoilLogic from './soilLogic';

// const SoilStatus = () => {

//   const { moistureStatus, phStatus } = useSoilLogic();

//   return (
//     <div className="soil-status">
//       <div className="soil-card-d">
//         <FaTint className="soil-icon" />
//         <p>
//           Soil moisture state: <span className={moistureStatus.className}>
//           {moistureStatus.text}</span>
//         </p>
//       </div>
//       <div className="soil-card-d">
//         <FaAtom className="soil-icon" />
//         <p>Soil pH state: <span className={phStatus.className}>{phStatus.text}</span></p>
//       </div>
//     </div>
//   );
// };

// export default SoilStatus;

import React from 'react';
import { FaTint, FaAtom, FaCloudSun } from 'react-icons/fa';
import useSoilLogic from './soilLogic';

const SoilStatus = () => {
  const { moistureStatus, phStatus, weather, weatherError, geminiData, geminiError } = useSoilLogic();

  return (
    <div className="soil-status">
      <div className="soil-card-d">
        <FaTint className="soil-icon" />
        <p>
          Soil moisture state: <span className={moistureStatus.className}>{moistureStatus.text}</span>
        </p>
      </div>
      <div className="soil-card-d">
        <FaAtom className="soil-icon" />
        <p>
          Soil pH state: <span className={phStatus.className}>{phStatus.text}</span>
        </p>
      </div>
      <div className="soil-card-d">
        <FaCloudSun className="soil-icon" />
        <p>
          Weather: {weatherError ? (
            <span className="status-poor">{weatherError}</span>
          ) : weather ? (
            <span>{weather.weather[0].description}, {weather.main.temp}°C</span>
          ) : (
            <span>Loading...</span>
          )}
        </p>
      </div>
      {/* Placeholder for Gemini API data display  */}
       {/* <div className="soil-card-d">
        <FaBrain className="soil-icon" />
        <p>
          AI Analysis: {geminiError ? (
            <span className="status-poor">{geminiError}</span>
          ) : geminiData ? (
            <span>{geminiData.result}</span>
          ) : (
            <span>Loading...</span>
          )}
        </p>
      </div>  */}
    </div>
  );
};

export default SoilStatus;