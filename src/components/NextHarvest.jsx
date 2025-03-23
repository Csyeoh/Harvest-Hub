import React from 'react';

const NextHarvest = () => {
  return (
    <div className="harvest-card">
      <table>
        <td>
          <div>
            <h3>Next Harvest</h3>
            <p>22/3/2025</p>
          </div>
        </td>
        <td>
          <div className="progress-circle">
            <span><p>Achieved</p>
            <p><b>88%</b></p>
            </span>
          </div>
        </td>
      </table>
    </div>
  );
};

export default NextHarvest;