import { Routes, Route } from 'react-router-dom';
import CleanDataSet from './components/CleanDataSet'
import UnusualDataSet from './components/UnusualDataSet.tsx'
import App from './App.jsx'
function MainApp() {
  return (
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/clean/' element={<CleanDataSet/>}/>
      <Route path='/unusual/' element={<UnusualDataSet/>}/>
    </Routes>
  )
};

export default MainApp;
