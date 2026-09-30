import React from 'react';
import Hero from '../common/Hero';
import MapSection from '../common/MapSection';
import Reviews from '../common/Reviews';
import PublicNav from '../common/PublicNav';
import PublicFooter from '../common/PublicFooter';

const PublicHomepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <PublicNav />
      <main className="pt-20">
        <Hero isPublicHomepage={true} />
        <MapSection />
        <Reviews />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicHomepage; 