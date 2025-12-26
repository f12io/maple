export { startRuntime } from './core/bootstrap';
export * from './core/types';
// Re-export feature modules individually for tree-shaking
export * from './engines/maple';
export * from './engines/maple/matcher';
export { loadPrecalculatedProperties } from './engines/maple/property-extraction';
