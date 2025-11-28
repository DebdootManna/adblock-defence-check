import React from 'react';
import { motion } from 'framer-motion';

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  return d;
};

const ResultChart = ({ protectedCount, totalCount }) => {
  if (totalCount === 0) return null;

  const protectedPercentage = (protectedCount / totalCount) * 100;
  
  const protectedAngle = (protectedPercentage / 100) * 359.99;
  
  const size = 160; // Made slightly smaller for the sidebar
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Base ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--prussian-blue)"
          strokeWidth={strokeWidth}
        />
        {/* Allowed/Vulnerable arc */}
        <motion.path
          d={describeArc(center, center, radius, 0, 359.99)}
          fill="none"
          stroke="var(--accent-color)" 
          strokeWidth={strokeWidth}
          initial={{ pathLength: 1, opacity: 0 }}
          animate={{ opacity: (totalCount - protectedCount > 0 ? 1 : 0) }}
          transition={{ duration: 0.5 }}
        />
         {/* Blocked/Protected arc */}
         <motion.path
          d={describeArc(center, center, radius, 0, 359.99)}
          fill="none"
          stroke="var(--platinum)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: protectedPercentage / 100 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
      }}>
        <div style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 700, fontFamily: 'Oswald' }}>
            {`${Math.round(protectedPercentage)}%`}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            Blocked
        </div>
      </div>
    </div>
  );
};

export default ResultChart;
