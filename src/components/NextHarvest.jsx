import React from 'react';

const NextHarvest = () => {
  return (
    <div className="harvest-card fade-in">
      <table>
        <tbody>
          <tr>
            <td>
              <div>
                <h3>Next Harvest</h3>
                <p>22/1/2026</p>
              </div>
            </td>
            <td>
              <div className="progress-circle">
                <span>
                  <p>Achieved</p>
                  <p><b>30%</b></p>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NextHarvest;