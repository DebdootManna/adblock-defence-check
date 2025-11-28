import React from 'react';
import { motion } from 'framer-motion';

const CategoryBarChart = ({ results }) => {
  const categories = [...new Set(results.map(r => r.category))];
  
  const categoryData = categories.map(category => {
    const testsInCategory = results.filter(r => r.category === category);
    const total = testsInCategory.length;
    const blocked = testsInCategory.filter(r => r.status === 'BLOCKED').length;
    const percentage = total > 0 ? (blocked / total) * 100 : 0;
    return { name: category, percentage };
  });

  return (
    <div style={{ width: '100%', marginTop: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontFamily: 'Oswald', textTransform: 'uppercase', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.05em' }}>Categorical Analysis</h2>
        {categoryData.map((cat, index) => (
            <div key={cat.name} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'Oswald', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{cat.name}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{`${Math.round(cat.percentage)}%`}</span>
            </div>
            <div style={{ height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '5px', overflow: 'hidden' }}>
                <motion.div
                style={{ height: '100%', backgroundColor: 'var(--accent-color)', borderRadius: '5px' }}
                initial={{ width: 0 }}
                animate={{ width: `${cat.percentage}%` }}
                transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                />
            </div>
            </div>
        ))}
    </div>
  );
};

export default CategoryBarChart;