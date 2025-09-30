import { createContext, useContext } from 'react';

const LenisContext = createContext(null);

export const useLenisContext = () => {
  return useContext(LenisContext);
};

export default LenisContext;