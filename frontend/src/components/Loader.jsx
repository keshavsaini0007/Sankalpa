import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-sm"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export default Loader
