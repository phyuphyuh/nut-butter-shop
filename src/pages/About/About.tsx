import './About.scss';
import about1 from '../../assets/images/about1.jpg';
import about2 from '../../assets/images/about5.jpg';
import about3 from '../../assets/images/about3.jpg';
import about4 from '../../assets/images/about4.jpg';
import about5 from '../../assets/images/about2.jpg';

const About: React.FC = () => {
  return (
    <div className="about">
      <div className="about-header-img"></div>

      <header className="about-header">
        <h1>What we folks do</h1>
        <p>. . . and don't do</p>
      </header>

      <hr className="solidline" />

      <main className="about-container">
        <section className="ingredients whiteside">
          <h3>Ingredients</h3>
          <p>
            We are <strong>BIG</strong> on sourcing{' '}
            <strong>the best form</strong> of each ingredient
            <br /> that we put into our jars.
          </p>
          <p>
            This means we use: <br />
            <strong>organic sprouted</strong> nuts and seeds <br />
            high-quality <strong>spices</strong> <br />
            <strong>maple syrup, coconut sugar, or dates</strong> (for our sweetened jars) <br />
            and that's it! <br />
            <strong>So real, it's nuts!</strong>
          </p>
        </section>

        <div className="image-container about1">
          <img
            className="images"
            src={about1}
            alt="blue bowl with nut butter"
          />
        </div>

        <section className="ingredients2 blueside">
          <p>
            We <em>NEVER</em> use refined sugar, hydrogenated oils or palm oil, food additives,
            emulsifiers, and other ingredients that don't promote well-being.
          </p>
        </section>

        <section className="certified whiteside">
          <p>
            All of our products are certified{' '}
            <strong>organic and Non-GMO</strong>.
          </p>
        </section>

        <div className="image-container about2">
          <img
            className="images"
            src={about2}
            alt="cookies with nut butter"
          />
        </div>

        <section className="satisfy blueside">
          <h3>Wildly satisfying</h3>
          <ul>
            <li>
              Top your brekkie <strong>oats</strong> with a generous spoonful of creamy{' '}
              <strong>almond</strong> butter
            </li>
            <li>
              Slather a good <strong>slab of sourdough</strong> with <strong>pecan</strong> butter
            </li>
            <li>
              Make a batch of luscious <strong>tahini rye cookies</strong>
            </li>
            <li>
              A simple <strong>peanut butter & banana</strong> toast
            </li>
            <li>
              <strong>Sunflower</strong> maple <strong>halva</strong>
            </li>
            <li>
              Go savory and make a quick <strong>cashew dip</strong>
            </li>
            <li>
              and most definitely, a <strong>turmeric-tahini sauce</strong> and drizzle it over
              anything and everything!
            </li>
          </ul>
        </section>

        <div className="image-container about3">
          <img
            className="images"
            src={about3}
            alt="cashew toast"
          />
        </div>

        <div className="image-container about4">
          <img
            className="images"
            src={about4}
            alt="oats with nut butter"
          />
        </div>

        <section className="staple whiteside">
          <h3>Make blue jar a staple in your pantry</h3>
          <p>
            Highly <strong>nutritious</strong>, incredibly{' '}
            <strong>versatile</strong>, insanely{' '}
            <strong>craveable</strong>, conveniently{' '}
            <strong>sustainable</strong>
          </p>
          <p>
            We are an <strong>indulgence</strong> that
            <br />
            does <em>not</em> compromise
            <br />
            your body nor our planet.
          </p>
        </section>

        <div className="image-container about5">
          <img
            className="images"
            src={about5}
            alt="oats with nut butter"
          />
        </div>
      </main>
    </div>
  );
};

export default About;
