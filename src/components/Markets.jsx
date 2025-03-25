import React from 'react';

const Markets = () => {
  return (
    <div className="markets-card">
      <h3>Current Price</h3>
      <div className="market-item">
        <p>Cauliflower</p>
        <p className="">RM/kg</p>
      </div>
      <div className="market-item">
        <p className='market-value positive'>+0.08%</p>
        <p className="market-value">50</p>
      </div>
    </div>
  );
};

export default Markets;