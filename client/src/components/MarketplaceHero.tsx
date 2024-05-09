import React from 'react'
import { motion } from 'framer-motion'
import hero from '../assets/hero.png'

function MarketplaceHero() {
  const styles = {
    bgGradient:
      'bg-gradient-to-br to-emerald-780/20 via-emerald-950/20 from-emerald-600/20',
    btn: 'px-5 rounded-md font-medium border-emerald-600 py-2 bg-emerald-700 hover:bg-emerald-700 hover:border-indigo-700 text-3xl',
  }

  const parentVariants = {
    hidden: { x: -300, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { when: 'beforeChildren', staggerChildren: 0.3 },
    },
  }
  const imgVariants = {
    hidden: { x: 500, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { delay: 0.5 },
    },
  }
  const childVariants = {
    hidden: { x: -300, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
    },
  }

  return (
    <>
      <section
        className={`py-36 p-4 md:py-52 relative overflow-hidden text-white ${styles.bgGradient}`}
      >
        {/* Backgound */}
        <motion.div
          variants={parentVariants}
          initial='hidden'
          animate='show'
          className='absolute  inset-0 bg-no-repeat bg-bottom -z-10'
        >

        </motion.div>
        {/* Content */}
        <div className='container max-w-screen-lg mx-auto'>
          <motion.div
            variants={parentVariants}
            initial='hidden'
            animate='show'
            className='flex flex-col space-y-6 items-start'
          >
            {/* Heading */}
            <motion.h1
              variants={childVariants}
              className='text-5xl font-bold max-w-lg leading-normal'
            >
              Discover Exclusive Digital banners
            </motion.h1>
            {/* Paragraph */}
            <motion.p variants={childVariants} className=' text-2xl max-w-lg leading-6'>
              We are a huge marketplace dedicated to providing the best banners.
            </motion.p>
            {/* CTA */}
            <motion.button variants={childVariants} className={styles.btn}>
              Discover
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default MarketplaceHero
