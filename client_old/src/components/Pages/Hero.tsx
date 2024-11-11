import { Link } from 'react-router-dom';

import illustrationIntro from '../../assets/images/illustration-intro.jfif';

const Hero = () => {
  return (
    <section id='hero'>
      {/* Flex Container */}
      <div className='container flex flex-col-reverse pt-3 px-6 mx-auto  space-y-0 md:space-y-0 md:flex-row'>
        {/* Left Item */}
        <div className='flex flex-col space-y-12 md:w-1/2 '>
            <h1 className='max-w-md text-4xl font-bold text-center md:text-5xl md:text-left'>
                Gather Your Seeds, Develop Your Strategy, Harvest Victory
            </h1>
          <p className='max-w-sm text-center text-darkGrayishBlue md:text-left'>
            Empower your moves, outsmart your opponents, and stay focused on the ultimate goal of harvesting the most seeds.
          </p>

        </div>
        {/* Image */}
        <div className='md:w-1/2'>
          <img className='rounded-lg' src={illustrationIntro} alt='' />
        </div>
      </div>
    </section>
  );
};

export default Hero;