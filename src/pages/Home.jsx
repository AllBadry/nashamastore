import React from 'react';


import Hero from '../components/sections/Hero';
import Offers from '../components/sections/Offers';
import Categories from '../components/sections/Categories';
import Features from '../components/sections/Features';
import Contact from '../components/sections/Contact';


function Home() {
  return (
    <div>
      <section>
          <Hero />
          <Offers />
          <Categories />
          <Features />
          <Contact />
      </section>
    </div>
  );
}


export default Home;
