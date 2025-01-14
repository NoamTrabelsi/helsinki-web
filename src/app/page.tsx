"use server";

import HomeComponent from '@/components/home-component';
// import HometestComponent from '@/components/home-test';

const HomePage = async() => {  
  return (
    <HomeComponent />
    // <HometestComponent />
  );
};
export default HomePage;