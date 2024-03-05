import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import toast from 'react-hot-toast';
import axios from 'axios';
import UserBadgeItem from '../UserBadgeItem/UserBadgeItem';
import UserListItem from '../UserListItem/UserListItem';

const style = {
    position: 'absolute',
    top: '56%',
    zIndex : "9999999999",
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 950,
    // height : 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  


const AddTask = ({ reload, open, setOpen, handleOpen, handleClose }) => {
    const managerData = JSON.parse(localStorage.getItem('managerData'));
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

 const categories = [
    "tez",
    "1-kunlik",
    "3-kunlik",
    "1-haftalik"
 ]

 const [searchQuery, setSearchQuery] = useState('');
const [searchResult, setSearchResult] = useState([]);



 const [title, setTitle] = useState('')
 const [desc, setDesc] = useState('')
 const [deadline, setDeadline] = useState('')
 const [category, setCategory] = useState('')
const [selectedWorkers, setSelectedWorkers] = useState([]);



const handleWorkersAdd=(userToAdd)=>{
  if(selectedWorkers.includes(userToAdd)){
    return toast.error("Bu ishchi allaqachon qo'shilgan")
  }
  setSelectedWorkers([...selectedWorkers, userToAdd])
}

const handleWorkersDelete = (delUser)=>{
  setSelectedWorkers(selectedWorkers.filter(e=> e._id !== delUser?._id))
}





const handleSearch = async (query)=>{
  if(!query){
    return
  }
  setSearchQuery(query)
  try {
    const { data } = await axios.get(`${BACKEND_URL}/api/users?search=${searchQuery}`);
        setSearchResult(data.data);
  } catch (error) {
    toast.error(error.message)
  }
}


async function handleAddTask(e){
  e.preventDefault();
  
  try {
    if(!title.trim().length){
      throw new Error(`Vazifa nomini kiriting`)
    }else if(!desc.trim().length){
      throw new Error(`Vazifa haqida qo'shimcha malumot bering`)
    }else if(!deadline.trim().length){
      throw new Error(`Vazifani tugatish sanasini kiriting`)
    }else if(!category){
      throw new Error(`Vazifa turini kiriting, misol uchun: tez, 1-kunlik, 3-kunlik, 1-haftalik`)
    }else if(!selectedWorkers.length){
      throw new Error(`Vazifaga ishchi biriktiring!`)
    }
    const { data } = await axios.post(`${BACKEND_URL}/api/tasks`, {
      title,
      desc,
      deadline,
      category,
      workers : selectedWorkers.map(e=> e._id)
    }, { headers : { token : managerData?.token } })
    if(data.success){
       toast.success(data.message);
       handleClose();
       setTitle('')
       setDesc('')
       setDeadline('')
       setSelectedWorkers([]);
       reload();
    }else{
      throw new Error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}

  return (
    <Modal
     open={open}
     onClose={handleClose}
     aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
         <Box sx={style}>
          <Typography>Vazifa qo'shish</Typography>
           <form className='mt-4 relative' onSubmit={handleAddTask}>
           <div className='inputs flex flex-col gap-3'>
            <input className='form-control' placeholder='Vazifa nomi' value={title} onChange={e=> setTitle(e.target.value)}/>
            <input className='form-control' placeholder="Qo'shimcha malumot" value={desc} onChange={(e=> setDesc(e.target.value))}/>
            <label>
             Tugatish sanasi
            <input className='form-control mt-1' type='date' placeholder="Tugatish sanasi" value={deadline} onChange={e=> setDeadline(e.target.value)}/>
            </label>
                <select className='form-select' value={category} onChange={e=> setCategory(e.target.value)}>
                {categories.map((el, idx)=>(
                    <option key={idx} value={el}>{el}</option>
                ))}
                </select>
                <input placeholder="Ishchi qo'shing misol uchun : Eshmat, Toshmat"
                  onChange={e=> handleSearch(e.target.value)}
                  className='form-control'
                />

                <Box width={'100%'} display={'flex'} flexWrap={'wrap'}>
                  {selectedWorkers.map((el, idx)=>(
                    <UserBadgeItem key={idx} user={el} handleFunction={()=> handleWorkersDelete(el)}/>
                  ))
                  }
                </Box>
                <Box
                display={'flex'}
                gap={'2em'}
                flexWrap={'wrap'}
                >
                {
                  searchResult?.slice(0, 4)
                  .map((user, idx)=>(
                    <UserListItem
                      key={idx}
                      user={user}
                      handleFunction={()=> handleWorkersAdd(user)}
                    />
                  ))
                }
                </Box>
           </div>
           <div className='btns   flex justify-between '>
            <button className='text-slate-600' onClick={handleClose}>Bekor qilish</button>
            <button className='text-blue-600'>Qo'shish</button>
           </div>
           </form>
    </Box>
    </Modal>
  )
}

export default AddTask
