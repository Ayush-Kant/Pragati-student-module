import { Toaster } from "react-hot-toast";
import { Routes, Route } from 'react-router-dom';
import Dashboard from './features/mentor/pages/Dashboard';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/mentor/dashboard' element={<Dashboard/>}/>
      </Routes>
    </>
  );
}

export default App;