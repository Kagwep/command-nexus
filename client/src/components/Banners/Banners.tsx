import NFTCardsList from './NFTCardsList'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { motion } from 'framer-motion'
import {
  parentNFTVariants,
  parentVariants,
  childVariants,
} from '../../animations/banners'
function Banners() {
  return (
    <>
      <section className='p-4 pb-24 text-white'>
        <div className='container max-w-screen-lg mx-auto overflow-hidden'>
          <div className='flex flex-col items-center space-y-8'>
            {/* Content */}
            <motion.div
              variants={parentVariants}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true }}
              className='flex flex-col items-center space-y-4 '
            >
              <motion.h1
                variants={childVariants}
                className='text-5xl md:text-5xl font-medium'
              >
                Explore Banners
              </motion.h1>
              <motion.p
                variants={childVariants}
                className='text-slate-400 max-w-lg text-center text-2xl'
              >
                We are a huge marketplace dedicated to connecting great artists
                of all Loalty with their fans and unique token collectors!
              </motion.p>
            </motion.div>
            {/* Collection of NFTs */}
            <motion.div
              variants={parentNFTVariants}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true }}
              className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8'
            >
              {/* Card 1 */}
              <NFTCardsList />
            </motion.div>
            <div className='md:flex items-center space-x-2 text-slate-400 font-semibold hidden  '>
              <p className='text-2xl'>Explore All Items</p>
              <AiOutlineArrowRight size={12} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Banners
