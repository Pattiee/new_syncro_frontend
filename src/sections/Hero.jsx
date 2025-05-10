import React, { useState } from 'react'


const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "our store";
const TAG_LINE = process.env.REACT_APP_TAG_LINE || "Your favorite products, just a click away.";

const Hero = () => {
    const [images, setImages] = useState([
        '../assets/images/lg.png',
        '../assets/images/pk.png',
    ]);


    return (
        <section className="relative h-[50vh] w-full overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300  dark:from-orange-600 dark:via-orange-500 dark:to-orange-400 text-gray-100 dark:text-gray-100 py-20 px-6 text-center transition-colors duration-300">
            <div className='absolute top-0 left-0 w-[300%] h-full flex animate-slide'>
                {images.concat(images).map((src, index) => (
                    <div key={index} className='h-full w-1/3 flex-shrink-0'>
                        <img
                            src={src}
                            alt={`Hero ${index}`}
                            className='h-full w-full object-cover opacity-60'
                        />
                    </div>
                ))}
            </div>

            <div className='absolute inset-0 bg-black bg-opacity-10 dark:bg-black dark:bg-opacity-10' />
            
            <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>

                {/* Heading */}
                <h1 className="text-gray-100 dark:text-gray-200 text-4xl sm:text-5xl md:text-5xl font-serif font-semibold mb-3 animate-slide-in">Welcome to {SHOP_NAME}</h1>

                {/* Subheading */}
                <p className="text-gray-100 text-lg sm:text-xl font-light md:text-xl mb-6 animate-fade-in">{TAG_LINE}</p>

                {/* Call To Action (CTA) button */}
                <button className="bg-gray-100 dark:bg-gray-800 text-orange-500 dark:text-orange-300 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed"> Shop Now </button>
            </div>
        </section>
    )
}

export default Hero
