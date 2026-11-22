import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // পেজ পরিবর্তন হলে আগের স্ক্রল পজিশন লোড করবে
    const savedPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
    const savedY = savedPositions[pathname] || 0;
    setTimeout(() => window.scrollTo(0, savedY), 100);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const savedPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
      savedPositions[window.location.pathname] = window.scrollY;
      sessionStorage.setItem('scrollPositions', JSON.stringify(savedPositions));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
};
export default ScrollToTop;
