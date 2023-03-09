import React from 'react';

function HeroSection() {
  const headings = [
    'Sports Gear',
    'Athletic Apparel',
    'Footwear',
    'Accessories',
  ];
  const handleButtonClick = () => {
    const mainDiv = document.getElementById('main');
    mainDiv.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div
      className="bg-[url('/images/cover-hero.jpg')] bg-cover bg-no-repeat 
   mb-4 text-center rounded-lg"
    >
      <div className="bg-black/60 px-4 py-28 ">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-8 font-serif">
          Welcome to our Sports Store
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {headings.map((heading) => (
            <h2
              key={heading}
              className="text-xl md:text-2xl font-serif text-white font-medium 
              
               text-black   tracking-wide"
            >
              {heading}
            </h2>
          ))}
        </div>
        <button
          onClick={handleButtonClick}
          className="bg-amber-400 text-black px-8 py-3 rounded-full mt-12
           hover:bg-white transition-all rounded-full font-serif shadow-md"
        >
          Shop Now
        </button>
        <p className="text-white text-sm mt-8 font-serif">
          Free Shipping on Orders Over Rs 2000 | Easy Returns | 24/7 Customer
          Support
        </p>
      </div>
    </div>
  );
}

export default HeroSection;
