import React from 'react'
import { motion } from 'framer-motion'

const PageTransitionAnimation = ({ children }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.2
      }}
      style={{
        marginTop: '60px',
        position: 'relative'
      }}
    >
      {children}
    </motion.div>
  )
}
export default PageTransitionAnimation
