import React from 'react';
import { motion } from 'framer-motion';
import './TestResultRow.css';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TestResultRow = ({ category, target, status, index }) => {
  return (
    <motion.div
      className="test-row-minimal"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: index * 0.03 }}
    >
      <div className="test-category">{category}</div>
      <div className="test-target-minimal">{target}</div>
      <div className="test-status-minimal">
        <span className={`status-text status-${status.toLowerCase()}`}>{status}</span>
      </div>
    </motion.div>
  );
};

export default TestResultRow;