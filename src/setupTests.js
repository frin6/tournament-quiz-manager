import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Suppress React 18 warnings in tests
const originalError = console.error;
console.error = (...args) => {
  if (/Warning: ReactDOM.render is no longer supported in React 18/.test(args[0])) {
    return;
  }
  if (/Warning: `ReactDOMTestUtils.act` is deprecated/.test(args[0])) {
    return;
  }
  if (/Warning: unmountComponentAtNode is deprecated/.test(args[0])) {
    return;
  }
  originalError.apply(console, args);
};

configure({
  testIdAttribute: 'data-testid',
}); 