import { useEffect } from 'react';
import IndexRouter from './routes/index'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';


function App() {
  const navigate = useNavigate();

  const managerData = JSON.parse(localStorage.getItem('managerData'));

 useEffect(()=>{
  if(!managerData){
    navigate('/login')
  }
 }, [managerData])

  return (
    <div className="App">
      <IndexRouter/>
      <Toaster/>
    </div>
  )
}
export default App
