import React from 'react'
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import PlatformInsights from '../components/PlatformInsights';
import OurPolicy from '../components/OurPolicy';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
  return (
    <>
      <Hero/> 
      <PlatformInsights/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsLetter/>
    </>
  )
}

export default Home;
