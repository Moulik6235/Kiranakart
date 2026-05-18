import React from 'react'
import MainBanner from '../components/MainBanner'
import PromiseBanner from '../components/PromiseBanner'
import Categories from '../components/Categories'
import HotDeals from '../components/HotDeals'
import TrendingNow from '../components/TrendingNow'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <div className='mt-6 space-y-12 pb-12'>
      <MainBanner />
      <PromiseBanner />
      <Categories />
      <HotDeals />
      <TrendingNow />
      <NewsLetter />
    </div>
  )
}

export default Home
