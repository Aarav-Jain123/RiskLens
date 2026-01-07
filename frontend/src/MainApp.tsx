import { Routes, Route } from 'react-router-dom';
import UnusualDataSet from '..src/components/CleanDataSet.tsx'
import CleanDataSet from '..src/components/UnusualDataSet.tsx'

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
