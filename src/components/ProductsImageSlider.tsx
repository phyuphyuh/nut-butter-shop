import { useState, useEffect } from 'react';
import cashewButterImg from '../assets/images/cashewbutter.jpg';
import peanutButterImg from '../assets/images/peanutbutter.jpg';
import sunButterImg from '../assets/images/sunbutter.jpg';
import tahiniImg from '../assets/images/tahini.jpg';
import pecanButterImg from '../assets/images/pecanbutter.jpg';
import almondButterImg from '../assets/images/almondbutter.jpg';

const productImages = [
  peanutButterImg,
  sunButterImg,
  tahiniImg,
  pecanButterImg,
  almondButterImg,
  cashewButterImg,
];

const ProductsImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % productImages.length);
    }, 1000); // 1 second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="products-img">
      <img src={productImages[currentIndex]} alt="Product" />
    </div>
  );
};

export default ProductsImageSlider;
