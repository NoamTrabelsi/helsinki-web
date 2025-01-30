import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: '/helsinki-web',
	// basePath: '/helsinki-web',
  // async rewrites() {
  //   return [
  //     {
  //       source: '/mailer', // הכתובת בה תלחץ על הכפתור
  //       destination: 'https://www.ynet.co.il/home/0,7340,L-8,00.html', // הכתובת אליה תרצה להפנות
  //     },
  //   ]
  // },
};

export default nextConfig;


//https://service.prodify.com/hlsinki-web/mailer
// http://localhost:3001