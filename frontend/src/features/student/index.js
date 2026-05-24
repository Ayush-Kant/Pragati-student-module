// index.js
// Purpose: Barrel export for the student feature module — exposes StudentRoutes and auth utilities

export { default as StudentRoutes } from './routes/StudentRoutes';
export { useAuth, AuthProvider } from './context/AuthContext';
