import React from 'react';
import { FaTint, FaAtom } from 'react-icons/fa';

const SoilStatus = () => {
  return (
    <div className="soil-status">
      <div className="soil-card-d">
        <FaTint className="soil-icon" />
        <p>Soil moisture state: <span className="status-excellent">excellent</span></p>
      </div>
      <div className="soil-card-d">
        <FaAtom className="soil-icon" />
        <p>Soil pH state: <span className="status-excellent">excellent</span></p>
      </div>
    </div>
  );
};

export default SoilStatus;