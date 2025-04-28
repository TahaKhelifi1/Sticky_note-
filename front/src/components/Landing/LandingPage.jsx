import React from 'react';
import Header from './Header';
import FeaturesSection from './FeaturesSection';
import Footer from './Footer';
import './styles/LandingPage.scss';
import Img from '../../assets/Img6.png'
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <main className="main-content">
        <section className="hero">
          <div className="hero-text">
            <h1>Organize Your Life with Sticky Notes</h1>
            <p>The easiest way to manage your notes, tasks, and ideas. Anytime, anywhere.</p>
            <Link to="/sign-up" className="cta-button">Get Started</Link>
          </div>
          <div className="hero-image">
            <img src={Img} alt="Sticky Notes App" />
          </div>
        </section>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
