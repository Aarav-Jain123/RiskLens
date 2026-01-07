import { Routes, Route } from 'react-router-dom';
import CleanDataSet from './components/CleanDataSet'
import UnusualDataSet from './components/UnusualDataSet.tsx'

function MainApp() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/clean/' element={<CleanDataSet/>}/>
      <Route path='/unusual/' element={<UnusualDataSet/>}/>
    </Routes>
  )
};

export default MainApp;
