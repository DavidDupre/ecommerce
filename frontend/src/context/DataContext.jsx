import axios from 'axios';
import { createContext, useContext, useState } from 'react';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState();

  // fetching all products from api
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(
        'https://com-satisfactory-sticker-hours.trycloudflare.com/products',
      );
      console.log(res);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUniqueCategory = (data, property) => {
    let newVal = data?.map((curElem) => {
      return curElem[property];
    });
    newVal = ['All', ...new Set(newVal)];
    return newVal;
  };

  const categoryOnlyData = getUniqueCategory(data, 'category');
  const brandOnlyData = getUniqueCategory(data, 'brand');
  return (
    <DataContext.Provider
      value={{ data, setData, fetchAllProducts, categoryOnlyData, brandOnlyData }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const getData = () => useContext(DataContext);
