import React, { useEffect, useCallback, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import CloudUpload from "@mui/icons-material/CloudUpload";
import axios from "axios";

import "./Card.css";
import { Button, ButtonGroup, IconButton } from "@mui/material";
import toast from "react-hot-toast";
import { Delete, Edit } from "@mui/icons-material";
import EditTask from "../EditTask/EditTask";

const Card = ({ data, index, reload }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const managerData = JSON.parse(localStorage.getItem("managerData"));
  const [file, setFile] = useState("");

  function formatDateToCustom(date) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("Please select a file");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      console.log(`${BACKEND_URL}/api/tasks/upload_file_to_task/${data?._id}`);

      // Send a POST request to upload the file
      const response = await axios.put(`${BACKEND_URL}/api/tasks/upload_file_to_task/${data?._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token : managerData?.token
        },
      });

      if(response.data.success){
          toast.success(response.data.message)
          reload();
      }else{
        throw new Error(response.data.message)
      }


      // Reset the file state
      setFile("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  function makeFileExtension(link){
    return link?.split(".").pop().toLowerCase();

  }


  async function DeleteTask(){
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/tasks/${data?._id}`, { headers : { token : managerData?.token } })
      if(response.data.success){
        toast.success(response.data.message);
        reload();
      }else{
        throw new Error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const [openEditTask, setOpenEditTask] = useState(false);
  const handleOpenTask = ()=> setOpenEditTask(true);
  const handleCloseTask = ()=> setOpenEditTask(false);

  return (
    <>
      <div className={`card border ${data?.status == 'pending' ? "border-yellow-300" : data?.status == 'checked' ? "border-success" : data?.status == 'done' ? "border-slate-600" : "border-danger"} shadow-0 mb-3`}>
          <EditTask reload={reload} task={data} open={openEditTask} setOpen={setOpenEditTask} handleClose={handleCloseTask} handleOpen={handleOpenTask}/>
        <div className={`card-header bg-transparent ${data?.status == 'pending' ? "border-yellow-300" : data?.status == 'checked' ? "border-success" : data?.status == 'done' ? "border-slate-600" : "border-danger"} `}>
          <p>№ {index}</p>
          <Dropdown>
          <Dropdown.Toggle
              variant={data?.status == 'pending' ? "border-yellow-300" : data?.status == 'checked' ? "border-success" : data?.status == 'done' ? "border-slate-600" : "border-danger"}
              id="dropdown-basic"
              className="dropdawnCard"
            ></Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1" className="dropdownItem">
                <p>Vazifa berilgan:</p>
                <p>{formatDateToCustom(data?.createdAt)}</p>
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2" className="dropdownItem">
                <p>Tugatish kerak:</p>
                <p>{formatDateToCustom(data?.deadline)}</p>
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3" className="dropdownItem">
                <p>Ishchilar:</p> <p>{data?.workers?.length}</p>
              </Dropdown.Item>
            </Dropdown.Menu>
            {/* ... (rest of the code unchanged) */}
          </Dropdown>
        </div>
        <div className="card-body">
          <h5 className="card-title">{data?.title}</h5>
          <p className={`card-text ${data?.status == 'pending' ? "border-yellow-300" : data?.status == 'checked' ? "border-success" : data?.status == 'done' ? "border-slate-600" : "border-danger"}`}>{data?.desc}</p>
          <div className="mt-3">
            {data?.worker_file ? (
              <>
              <a download={data?.worker_file} href={`${BACKEND_URL}/${data?.worker_file}`}>
                Download File
              </a>
              <p>{data?.worker_file.slice(10, 20)}.{makeFileExtension(data?.worker_file)}</p>
              <p className="mt-2 text-[14px]">Holati: {data?.status == 'pending' ? "Jarayonda" : data?.status == 'done' ? "Tekshirilmagan" : data?.status == 'checked' ? "Muvofaqqiyatli bajarilgan" : "Rad etilgan"}</p>
              </>
            ) : (
              <>
               <p className="mt-2 text-[14px]">Holati: {data?.status == 'pending' ? "Jarayonda" : data?.status == 'done' ? "Tekshirish kerak" : data?.status == 'checked' ? "Muvofaqqiyatli bajarilgan" : "Rad etilgan"}</p>
              </>
              
            )}
          </div>
        </div>
        <div className={`card-footer flex gap-4 bg-transparent ${data?.status == 'pending' ? "border-yellow-300" : data?.status == 'checked' ? "border-success" : data?.status == 'done' ? "border-slate-600" : "border-danger"}`}>
            {/* <button className="btn btn-info">O'zgartirish</button>
            <button className="btn btn-info">O'chirish</button> */}
          <Link className="" to={`/chat/${data?._id}`}>
            <button className="btn  btn-info">chat</button>
          </Link>
          <ButtonGroup>
            <IconButton onClick={handleOpenTask}><Edit color="warning"/></IconButton>
            <IconButton onClick={()=> DeleteTask()}><Delete color="error"/></IconButton>
          </ButtonGroup>
          
          
        </div>
        
      </div>
    </>
  );
};

export default Card;
