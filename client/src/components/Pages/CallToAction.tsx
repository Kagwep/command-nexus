import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section id='cta' className=''>
      {/* Flex Container */}
      <div className='container flex flex-col items-center justify-between px-6 py-24 mx-auto space-y-12 md:py-12 md:flex-row md:space-y-0'>
        {/* Heading */}
        <h5 className=' font-bold leading-tight text-center text-dark  md:text-left'>
            Master the Art of command-nexus Strategy
        </h5>
        {/* Button */}
        <div>
          <Link
            to='/play'
            className='p-3 px-6 pt-2 text-white bg-gray-900 rounded-full shadow-2xl baseline hover:bg-gray-900 '
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;