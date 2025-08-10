import React, { useState } from 'react';
import axios from 'axios';

const SalesForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSale = { customerName, productName, productPrice };

    try {
      await axios.post('http://localhost:5000/addSale', newSale);
      setCustomerName('');
      setProductName('');
      setProductPrice('');
      alert('Satış əlavə edildi!');
    } catch (error) {
      console.error('Satış əlavə edilərkən səhv oldu:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Müştərinin Adı:</label>
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
      </div>
      <div>
        <label>Məhsulun Adı:</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
      </div>
      <div>
        <label>Məhsulun Qiyməti:</label>
        <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required />
      </div>
      <button type="submit">Məhsul Əlavə et</button>
    </form>
  );
};

export default SalesForm;
