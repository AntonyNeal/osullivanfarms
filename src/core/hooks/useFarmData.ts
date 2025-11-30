import { useContext } from 'react';
import { FarmDataContext } from '../context/FarmDataTypes';

export function useFarmData() {
  const context = useContext(FarmDataContext);
  if (!context) {
    throw new Error('useFarmData must be used within a FarmDataProvider');
  }
  return context;
}
