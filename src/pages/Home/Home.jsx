import React, { useState, useEffect } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import TaskCard from "../../Components/TaskCard/TaskCard";
import Card from "../../Components/Card/Card";
import "./Home.css";
import { Typography } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import AddTask from "../../Components/AddTask/AddTask";
import EditProfileModal from "../../Components/EditProfileModal/EditProfileModal";

const Home = () => {
  const navigate = useNavigate()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [open, setOpen] = useState(true);
  const managerData = JSON.parse(localStorage.getItem("managerData"));

  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  async function GetTasks() {
    try {
      if (searchQuery) {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/tasks?search=${searchQuery}`,
          { headers: { token: managerData?.token } }
        );
        setTasks(data.data);
      } else {
        const { data } = await axios.get(`${BACKEND_URL}/api/tasks`, {
          headers: { token: managerData?.token },
        });
        setTasks(data.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function GetWorkers() {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/users`, {
        headers: { token: managerData?.token },
      });
      setWorkers(data.data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    GetTasks();
  }, [searchQuery]);

  useEffect(() => {
    GetWorkers();
  }, []);

  // const myRaiting = tasks[0]?.workers?.filter(el=>{
  //   return el._id == workerData?._id
  // })

  const [openAddTask, setOpenAddTask] = useState(false);
  const handleOpenTask = () => setOpenAddTask(true);
  const handleCloseTask = () => setOpenAddTask(false);


  const [openEdit, setOpenEdit] = useState(false);
  const handleEditOpen = ()=> setOpenEdit(true);
  const handleEditClose = ()=> setOpenEdit(false);

  return (
    <section className="flex overallPr">
       <EditProfileModal open={openEdit} setOpen={setOpenEdit} handleOpen={handleEditOpen} handleClose={handleEditClose}/>
      <div
        className={`bg-[#333] min-h-screen sidebarNav ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <AddTask
          reload={GetTasks}
          open={openAddTask}
          setOpen={setOpenAddTask}
          handleClose={handleCloseTask}
          handleOpen={handleOpenTask}
        />
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex text-white flex-col gap-4 relative">
          <div className="profileData text-white flex items-center flex-col gap-3">
            <img
              src={`${BACKEND_URL}/${managerData?.img}`}
              className="w-[70px] rounded-xl"
            />
            <Typography variant="h4" className="text-white">
              {managerData?.fullname}
            </Typography>
          </div>

          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  data-mdb-collapse-init
                  class="accordion-button"
                  type="button"
                  data-mdb-toggle="collapse"
                  data-mdb-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Statistik malumotlar
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-mdb-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <span className="Role styleShit">
                    <p>Ishchilar</p>
                    <p>{workers?.length}</p>
                  </span>
                  <span className="taskData styleShit">
                    <p>Vazifalar</p>
                    <p>{tasks?.length}</p>
                  </span>
                  <span className="taskDataInfo styleShit">
                    <p>Rad etilgan vazifalar</p>
                    <p>
                      {tasks?.filter((e) => e.status == "rejected").length}{" "}
                    </p>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebarSide mt-3">
            <span onClick={handleOpenTask}>
              <p>Yangi vazifa qo'shish</p>
              <p>
                <i class="fas fa-circle-plus"></i>
              </p>
            </span>
            <span>
              <p>Qorong'u rejim</p>
              <p>
                <i class="fas fa-circle-half-stroke"></i>
              </p>
            </span>
            <span onClick={handleEditOpen}>
                    <p>Profilni o'zgartirish</p>
                    <p><i class="fas fa-pen"></i></p>
                    </span>
                    <span onClick={()=> navigate('/workers')}>
                    <p>Ishchilar</p>
                    <p><i class="fas fa-users"></i></p>
                    </span>
          </div>
        </div>
      </div>
      <div className="m-2 text-xl text-gray-900 font-semibold big-wrapper">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="d-flex mt-4 cards-wrapper h-[100vh]">
          {tasks?.map((el, idx) => (
            <Card reload={GetTasks} key={idx} index={idx + 1} data={el} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
