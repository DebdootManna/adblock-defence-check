import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultChart from './components/ResultChart';
import CategoryBarChart from './components/CategoryBarChart';
import TestResultRow from './components/TestResultRow';
import { tests, STATUS } from './tests';
import './App.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function App() {
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const baitElements = [];
    const timeout = 2000;

    setResults(tests.map((test) => ({ ...test, status: STATUS.PENDING })));

    const runFinalChecks = () => {
      setResults((prevResults) =>
        prevResults.map((test) => {
          let newStatus = test.status;
          if (test.type === 'cosmetic') {
            const element = document.getElementById(test.id);
            if (element) newStatus = test.check(element);
          } else if (newStatus === STATUS.PENDING && test.type === 'network') {
            newStatus = STATUS.PROTECTED;
          }
          return { ...test, status: newStatus };
        })
      );
      setFinished(true);
    };

    tests.forEach((test) => {
      if (!test.bait) return;
      const el = document.createElement(test.bait.tag);
      el.id = test.id;
      Object.keys(test.bait.attrs).forEach((attr) => { el[attr] = test.bait.attrs[attr]; });
      if (test.type === 'network') {
        el.onload = () => setResults((prev) => prev.map((r) => (r.id === test.id ? { ...r, status: test.check(true) } : r)));
        el.onerror = () => setResults((prev) => prev.map((r) => (r.id === test.id ? { ...r, status: test.check(false) } : r)));
      }
      document.body.appendChild(el);
      baitElements.push(el);
    });

    const timer = setTimeout(runFinalChecks, timeout);
    return () => {
      clearTimeout(timer);
      baitElements.forEach((el) => { if (document.body.contains(el)) document.body.removeChild(el); });
    };
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
        {/* Left Column: Results List */}
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

        {/* Right Column: Charts and Info */}
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
                    <p>This page dynamically attempts to load scripts from known advertising and tracking domains. It also creates hidden page elements that are targeted by common cosmetic filter lists.</p>
                    <p>If a script fails to load, or if a page element is hidden from view, the test is marked as <span className="status-text status-blocked">BLOCKED</span>. If the request succeeds and the content is visible, it's marked as <span className="status-text status-allowed">ALLOWED</span>.</p>
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
