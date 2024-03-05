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
  


const EditTask = ({task, reload, open, setOpen, handleOpen, handleClose }) => {
    const managerData = JSON.parse(localStorage.getItem('managerData'));
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    console.log(task.deadline);


    const statusses = [
       {
            title : "Tekshirilmagan",
            val : "done"
        },
       {
            title : "Muvofaqqiyatli bajarilgan",
            val : "checked"
        },
        {
            title : "Rad etilgan",
            val : "rejected" 
        }
    ]

 const categories = [
    "tez",
    "1-kunlik",
    "3-kunlik",
    "1-haftalik"
 ]

 function convertToCustomFormat(dateString) {
    // Sanani Date objektiga o'girish
    var date = new Date(dateString);
  
    // Ko'rishni istaganingizdagi formatni yozing
    var customFormat = "DD-MM-YYYY";
  
    // O'zgartirilgan sanani formatga o'tkazish
    var convertedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                  .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1-$2-$3");
  
    return convertedDate;
  }

 const [searchQuery, setSearchQuery] = useState('');
const [searchResult, setSearchResult] = useState([]);



 const [title, setTitle] = useState(task?.title)
 const [desc, setDesc] = useState(task?.desc)
 const [deadline, setDeadline] = useState(convertToCustomFormat(task?.deadline))
 console.log(deadline);
 const [status, setStatus] = useState(task?.status)
 const [category, setCategory] = useState(task?.category)
const [selectedWorkers, setSelectedWorkers] = useState([]);



const handleWorkersAdd=async(userToAdd)=>{
  if(task.workers.includes(userToAdd)){
    return toast.error("Bu ishchi allaqachon qo'shilgan")
  }
  try {
    const { data } = await axios.put(`${BACKEND_URL}/api/tasks/add_worker`, {
        taskId : task?._id,
        workerId : userToAdd?._id
    }, {
        headers : { token : managerData?.token }
    })
    if(data.success){
        reload()
    }else{
        throw new Error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
//   setSelectedWorkers([...selectedWorkers, userToAdd])
}

const handleWorkersDelete = async(delUser)=>{
    try {
        const { data } = await axios.put(`${BACKEND_URL}/api/tasks/delete_worker`, {
            workerId : delUser?._id,
            taskId : task?._id
        }, { headers : { token : managerData?.token } })
        if(data.success){
            reload()
        }else{
            throw new Error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
  setSelectedWorkers(task.workers?.filter(e=> e._id !== delUser?._id))
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


async function handleEditTask(e){
  e.preventDefault();
  
  try {
    console.log(status);
    if(!title.trim().length){
      throw new Error(`Vazifa nomini kiriting`)
    }else if(!desc.trim().length){
      throw new Error(`Vazifa haqida qo'shimcha malumot bering`)
    }else if(!deadline.trim().length){
      throw new Error(`Vazifani tugatish sanasini kiriting`)
    }else if(!category){
      throw new Error(`Vazifa turini kiriting, misol uchun: tez, 1-kunlik, 3-kunlik, 1-haftalik`)
    }else if(!task?.workers.length){
      throw new Error(`Vazifaga ishchi biriktiring!`)
    }
    const { data } = await axios.put(`${BACKEND_URL}/api/tasks/edit/${task?._id}`, {
      title,
      desc,
      status : status || null,
      deadline : deadline || null,
      category,
      workers : task?.workers?.map(e=> e._id)
    }, { headers : { token : managerData?.token } })
    if(data.success){
       toast.success(data.message);
       handleClose();
       
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
          <Typography>Vazifani o'zgartirish</Typography>
           <form className='mt-4 relative' onSubmit={handleEditTask}>
           <div className='inputs flex flex-col gap-3'>
            <input className='form-control' placeholder='Vazifa nomi' value={title} onChange={e=> setTitle(e.target.value)}/>
            <input className='form-control' placeholder="Qo'shimcha malumot" value={desc} onChange={(e=> setDesc(e.target.value))}/>
            <label>
             Tugatish sanasi
            <input className='form-control mt-1' type='date' placeholder="Tugatish sanasi" value={deadline} onChange={(e)=>{
                setDeadline(e.target.value)
                }}/>
            </label>
            {
                    task?.worker_file ? <select value={status} onChange={(e)=> setStatus(e.target.value)} className='form-select'>
                    {/* <option value={''} disabled selected>Bajarilgan</option> */}
                        {statusses.map((el, idx)=>(
                            <option value={el.val} >{el.title}</option>
                        ))}
                    </select> : "Holat : Jarayonda"
                }
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
                  {task?.workers?.map((el, idx)=>(
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
            <button className='text-blue-600'>O'zgartirish</button>
           </div>
           </form>
    </Box>
    </Modal>
  )
}

export default EditTask
