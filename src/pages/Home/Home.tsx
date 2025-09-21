import './Home.scss';
import yumImg from '../../assets/images/yum.png';
import jarImg from '../../assets/images/jar.png';
import toastImg from '../../assets/images/toast.png';
import yogurtImg from '../../assets/images/yogurt.png';
import nutsImg from '../../assets/images/nuts.jpg';
import chiaImg from '../../assets/images/chiabowl.jpg';
import { Link } from 'react-router-dom';
import ProductsImageSlider from '../../components/ProductsImageSlider';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="home-header">
        <div className="home-header-text">
          <span style={{ color: 'var(--lightGrey)' }}>insanely</span><br />
          cravable, sustainable, <br />
          <span style={{ color: 'var(--lightBlue)' }}>spreadable, dippable</span>
        </div>
        <img className="header-img yum" src={yumImg} alt="yum" />
        <img className="header-img jar" src={jarImg} alt="jar" />
        <img className="header-img toast" src={toastImg} alt="toast" />
        <img className="header-img yogurt" src={yogurtImg} alt="yogurt" />
      </div>

      {/* Products Section */}
      <div className="home-products">
        <hr className="solidline" />
        <p>
          we make small-batch <span style={{ color: 'var(--orange)' }}>nut</span> and{' '}
          <span style={{ color: 'var(--tanOrange)' }}>seed butters</span> using real, nutrient-dense ingredients
        </p>
        <div className="products-img">
          <ProductsImageSlider />
        </div>
        <Link className="products-btn" to="/shop">
          View all products
        </Link>
        <hr className="solidline" />
      </div>

      {/* About Section */}
      <div className="home-about">
        <div className="about-left">
          <h3>Simple, real ingredients</h3>
          <ul>
            <li><strong>No</strong> refined sugar</li>
            <li><strong>No</strong> additives</li>
            <li><strong>No</strong> GMOs</li>
            <li><strong>No</strong> hydrogenated oils</li>
          </ul>
        </div>

        <img className="about-img nuts" src={nutsImg} alt="assorted nuts" />
        <img className="about-img bowl" src={chiaImg} alt="chia bowl with almond butter" />

        <div className="about-right">
          <h3>Nourishing and nutritious</h3>
          <p>
            Nuts are the quintessence of <br /> <strong>indulgence</strong> that<br />
            does <strong>not</strong> compromise <br /> your body nor our planet. <br />
            That's why we are <strong>nuts</strong> for 'em!
          </p>
        </div>

        <div className="notin"></div>
        <Link className="about-btn" to="/about">
          Learn more
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
