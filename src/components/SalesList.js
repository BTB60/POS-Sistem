import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const response = await axios.get('http://localhost:5000/sales');
      setSales(response.data);
    };

    fetchSales();
  }, []);

  return (
    <div>
      <h2>Satış Siyahısı</h2>
      <ul>
        {sales.map((sale, index) => (
          <li key={index}>
            Müştəri: {sale[0]}, Məhsul: {sale[1]}, Qiymət: {sale[2]} AZN
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesList;
