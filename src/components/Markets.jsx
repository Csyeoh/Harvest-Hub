import React from 'react';

const Markets = () => {
  return (
    <div className="markets-card">
      <h3>Price Trend</h3>
      <div className="market-item">
        <p>S&P 500</p>
        <p className="market-value positive">+0.08%</p>
      </div>
      <div className="market-item">
        <p>INX</p>
        <p className="market-value">5,667.56</p>
      </div>
    </div>
  );
};

export default Markets;