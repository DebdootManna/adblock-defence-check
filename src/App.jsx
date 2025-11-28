import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultChart from './components/ResultChart';
import CategoryBarChart from './components/CategoryBarChart';
import TestResultRow from './components/TestResultRow';
import { tests, STATUS } from './tests';
import './App.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function App() {
  const [results, setResults] = useState(() => tests.map(t => ({ ...t, status: STATUS.PENDING })));
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const runAllTests = async () => {
      const cosmeticBaitElements = [];

      // Create and append all cosmetic bait elements first
      tests.forEach(test => {
        if (test.type === 'cosmetic' && test.bait) {
          const el = document.createElement(test.bait.tag);
          Object.keys(test.bait.attrs).forEach(attr => {
            el[attr] = test.bait.attrs[attr];
          });
          document.body.appendChild(el);
          cosmeticBaitElements.push(el);
        }
      });
      
      // Allow a moment for the DOM to update and for cosmetic rules to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      const testPromises = tests.map(async (test) => {
        const result = { ...test };
        if (test.check) {
          if (test.type === 'network') {
            result.status = await test.check();
          } else if (test.type === 'cosmetic') {
            const element = document.getElementById(test.id);
            result.status = test.check(element);
          }
        }
        
        // Update state for this specific test as it completes
        setResults(prev => prev.map(r => r.id === result.id ? result : r));
        return result;
      });

      await Promise.all(testPromises);
      
      setFinished(true);

      // Cleanup cosmetic elements
      cosmeticBaitElements.forEach(el => {
        if (document.body.contains(el)) {
          document.body.removeChild(el);
        }
      });
    };

    runAllTests();
  }, []);

  const protectedCount = results.filter((r) => r.status === STATUS.PROTECTED).length;

  return (
    <>
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1>Browser Defence & Ad-Blocking Test</h1>
        <p>This utility runs a series of checks to see how effectively your browser blocks common ad networks, analytics trackers, and other online nuisances.</p>
      </motion.header>

      <div className="main-container">
        <div className="left-column">
          <div className="results-list-container">
            <div className="results-header">
              <div>Category</div>
              <div>Target Domain / Selector</div>
              <div>Status</div>
            </div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {results.map((test, index) => (
                <TestResultRow
                  key={test.id}
                  category={test.category}
                  target={test.target}
                  status={test.status}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
          <footer className="footer">
            <p>
              Created by <a href="https://github.com/DebdootManna" target="_blank" rel="noopener noreferrer">Debdoot Manna</a> |
              Portfolio: <a href="https://debdootmanna.me" target="_blank" rel="noopener noreferrer">debdootmanna.me</a>
            </p>
          </footer>
        </div>

        <div className="right-column">
          <AnimatePresence>
            {finished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="charts-container">
                  <ResultChart protectedCount={protectedCount} totalCount={results.length} />
                  <CategoryBarChart results={results} />
                </div>
                <div className="description-box">
                  <h3>How It Works</h3>
                  <p>This page uses the `fetch` API in 'no-cors' mode to test network-level blocking. If a request receives an error, it's considered <span className="status-text status-blocked">BLOCKED</span>. For cosmetic tests, it checks if specific elements are hidden by CSS rules.</p>
                  <p>This method accurately distinguishes between blocks from extensions and failures from other issues like CORS, preventing false positives.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default App;