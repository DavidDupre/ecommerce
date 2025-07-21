import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Category from '../../components/Categories/Category';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Banner from '../../components/Banner/Banner';
import axios from 'axios';
import { useState, useEffect } from 'react';

const localSlideData = [
  {
    id: 1,
    title: 'Welcome to Our Site',
    content: 'Slide 1',
    img: '/images/slide1.jpg',
  },
  {
    id: 2,
    title: 'Discover Our Features',
    content: 'Slide 2',
    img: '/images/slide2.jpg',
  },
];

const Home = () => {
  const [slides, setSlides] = useState(localSlideData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await axios.get('https://tu-api.com/slides');
        setSlides(data);
      } catch (err) {
        console.error('Error fetching slides, usando datos locales:', err);
        setError('No se pudieron cargar los slides. Mostrando versión local...');
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        onClick={onClick}
        className={`arrow ${className}`}
        style={{ zIndex: 3 }}
      >
        <ArrowLeft
          className="arrows"
          style={{
            ...style,
            display: 'block',
            borderRadius: '50px',
            background: '#f53347',
            color: 'white',
            position: 'absolute',
            padding: '2px',
            left: '50px',
          }}
        />
      </div>
    );
  };

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        onClick={onClick}
        className={`arrow ${className}`}
      >
        <ArrowRight
          className="arrows"
          style={{
            ...style,
            display: 'block',
            borderRadius: '50px',
            background: '#f53347',
            color: 'white',
            position: 'absolute',
            padding: '2px',
            right: '50px',
          }}
        />
      </div>
    );
  };

  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    nextArrow: <SampleNextArrow to="next" />,
    prevArrow: <SamplePrevArrow to="prev" />,
  };

  if (loading) {
    return <div>Cargando slides...</div>;
  }

  return (
    <div className="overflow-x-hidden">
      <Slider {...settings}>
        {slides.map((data) => (
          <div
            key={data.id}
            className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] -z-10"
          >
            <div className="flex flex-col md:flex-row gap-10 justify-center h-[600px] my-20 md:my-0 items-center px-4">
              <div className="md:space-y-6 space-y-3'">
                <h1 className="md:text-4xl text-xl font-bold uppercase line-clamp-2 md:line-clamp-3 md:w-[500px] text-white">
                  {data.title}
                </h1>
                <p className="md:w-[500px] line-clamp-3 text-gray-400 pr-7">{data.content}</p>
                <button className="bg-gradient-to-r from-red-500 to-purple-500 text-white px-3 py-2 rounded-md cursor-pointer mt-2">
                  Compra ahora
                </button>
              </div>
              <div className="order-1 sm:order-2">
                <div>
                  <img
                    src={data.img}
                    alt={data.title}
                    className="rounded-full w-[550px] hover:scale-105 transition-all shadow-2xl shadow-red-400"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <Category />
      <Banner />
    </div>
  );
};

export default Home;
