import { useNavigate } from 'react-router-dom';

const Category = () => {
  const navigate = useNavigate();
  const getData = [
    { id: 1, content: 'Slide 1', title: 'Welcome to Our Site', category: 'audio' },
    { id: 2, content: 'Slide 2', title: 'Discover Our Features', category: 'gaming' },
    { id: 3, content: 'Slide 3', title: 'Mobile Products', category: 'mobile' },
    { id: 4, content: 'Slide 4', title: 'TV Collection', category: 'tv' },
    { id: 5, content: 'Slide 5', title: 'Laptops Gallery', category: 'laptop' },
  ];

  const getUniqueCategory = (data, property) => {
    let newVal = data?.map((curElem) => {
      return curElem[property];
    });
    newVal = [...new Set(newVal)];
    return newVal;
  };

  const categoryOnlyData = getUniqueCategory(getData, 'category');

  return (
    <div className="bg-[#101829]">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-center md:justify-around py-7 px-4">
        {categoryOnlyData?.map((item, index) => {
          return (
            <div key={index}>
              <button
                onClick={() => navigate(`/category/${item}`)}
                className="uppercase bg-gradient-to-r from-red-500 to-purple-500 text-white px-3 py-1 rounded-md cursor-pointer"
              >
                {item}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category;
