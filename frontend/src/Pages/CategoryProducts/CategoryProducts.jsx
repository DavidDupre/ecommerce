import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProductListView from '../../components/ProductList/ProductListView';
import axios from 'axios';

const CategoryProduct = () => {
  const [searchData, setSearchData] = useState([]);
  const params = useParams();
  const category = params.category;
  const navigate = useNavigate();

  const getFilterData = async () => {
    try {
      const res = await axios.get(
        `http://ec2-54-210-169-255.compute-1.amazonaws.com:3000/products/category/${category}`,
      );
      const data = res.data.products;
      setSearchData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFilterData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {searchData.length > 0 ? (
        <div className="max-w-6xl mx-auto mt-10 mb-10 px-4">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-800 mb-5 text-white px-3 py-1 rounded-md cursor-pointer flex gap-1 items-center"
          >
            <ChevronLeft /> Back
          </button>
          {searchData.map((product, index) => {
            return (
              <ProductListView
                key={index}
                product={product}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px]">
          <video
            muted
            autoPlay
            loop
          ></video>
        </div>
      )}
    </div>
  );
};

export default CategoryProduct;
