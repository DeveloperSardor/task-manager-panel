import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import ChatHeader from "../../Components/ChatCard/ChatCard";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";
import { Button, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import UserModal from "../../Components/UserModal/UserModal";

const Chats = () => {
  const { id } = useParams();
  const managerData = JSON.parse(localStorage.getItem("managerData"));
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const socket = io(BACKEND_URL);
  const [socketConnected, setSocketConnected] = useState(false);

  const messageRef = useRef(null);

  const [chatData, setChatData] = useState();
  const [manager, setManager] = useState();
  const [messages, setMessages] = useState();
  const [task, setTask] = useState();

  async function GetChat() {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/chats/${id}`);
      setChatData(data.data?.chat);
      setMessages(data.data?.messages);
      setTask(data.data?.task);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function GetManager() {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/users?manager=true`);
      setManager(data.data);
    } catch (error) {
      toast.error(err.message);
    }
  }

  const [message, setMessage] = useState("");
  const [file, setFile] = useState("");

  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  

  useEffect(() => {
    GetChat();
  }, [id]);

  useEffect(() => {
    const addUserToSocket = () => {
      socket.emit("joinChat", id);
    };

    addUserToSocket();

    const handleReceiveNewMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    
    const handleDeletedMessage = (deletedMessageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== deletedMessageId)
      );
    };
    
    socket.on("receive-new-message", handleReceiveNewMessage);
    socket.on('messageDeleted', handleDeletedMessage)


    return () => {
      socket.off('messageDeleted', handleDeletedMessage)
      socket.off("receive-new-message", handleReceiveNewMessage); // Unsubscribe from the event when the component unmounts
    };
  }, [socket, id]);

  async function sendMessage() {
    try {
      if (!message.length) {
        return;
      }
      console.log(managerData);
      socket.emit("sendMessage", {
        messageData: {
          chat: chatData?._id,
          message,
        },
        userId: managerData?._id,
        taskId: id,
      });
      setMessage(""); // Set the message state to an empty string after sending
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    sendFile(selectedFile);
  };



 async function deleteMessage(msgId){
  try {
    socket.emit('deleteMessage', { messageId : msgId, taskId : id });
  } catch (error) {
    toast.error(error.message)
  }
 }



  //  async function sendFile(selectedFile) {
  //   console.log(selectedFile);
  //   try {
  //     if (!selectedFile) {
  //       toast.error("Please select a file.");
  //       return;
  //     }

  //     const reader = new FileReader();

  //     reader.onload = async (event) => {
  //       const fileBuffer = event.target.result;

  //       const messageData = {
  //         chat: chatData._id,
  //         file: {
  //           filename: selectedFile.name,
  //           buffer: fileBuffer,
  //         },
  //       };

  //       socket.emit("sendMessage", {
  //         messageData,
  //         userId: workerData._id,
  //         taskId: id,
  //       });

  //       setFile("");
  //     };

  //     reader.readAsArrayBuffer(selectedFile);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // }

  async function sendFile(selectedFile) {
    console.log(selectedFile);
    try {
      if (!selectedFile) {
        toast.error("Please select a file.");
        return;
      }

      const reader = new FileReader();

      reader.onload = async (event) => {
        const fileBuffer = event.target.result;

        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

        let messageData;

        if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
          // Image file
          messageData = {
            chat: chatData._id,
            file: {
              type: "image",
              filename: selectedFile.name,
              buffer: fileBuffer,
            },
          };
        } else if (["mp4", "avi", "mov"].includes(fileExtension)) {
          // Video file
          messageData = {
            chat: chatData._id,
            file: {
              type: "video",
              filename: selectedFile.name,
              buffer: fileBuffer,
            },
          };
        } else if (["zip"].includes(fileExtension)) {
          // Zip file
          messageData = {
            chat: chatData._id,
            file: {
              type: "zip",
              filename: selectedFile.name,
              buffer: fileBuffer,
            },
          };
        } else {
          // Other file types (PDF, Word, etc.)
          messageData = {
            chat: chatData._id,
            file: {
              type: "other",
              filename: selectedFile.name,
              buffer: fileBuffer,
            },
          };
        }

        socket.emit("sendMessage", {
          messageData,
          userId: managerData._id,
          taskId: id,
        });

        setFile("");
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    GetManager();
  }, []);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function formatDateToCustom(date) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  }

  function getFormattedTimeFromDate(dateString) {
    const date = new Date(dateString);
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return hour + ":" + minute;
  }


  const [open, setOpen] = useState(false);
  const handleOpen = ()=> setOpen(true);
  const handleClose = ()=> setOpen(false);
  const [modalUserId, setModalUserId] = useState(managerData?._id);


  async function deleteWorkerFromTask(workerId){
    try {
      const {  data } = await axios.put(`${BACKEND_URL}/api/tasks/delete_worker`, {
           workerId,
           taskId : id
      }, { headers : { token : managerData?.token } })
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className="chatWrapper bg-dark">
        <div className="chatWraps">
          <h3 className="chatWraps-title">Guruh a'zolari</h3>
          <ul className="chatWraps-body">
            {task?.workers?.map((el, idx) => (
              <li className="flex items-center gap-2 cursor-pointer"  onClick={()=>{
              handleOpen()
              setModalUserId(el?._id)
              }
              }>
                <img
                  className="w-[26px] rounded-md"
                  src={`${BACKEND_URL}/${el?.img}`}
                />
                {el?.fullname}
                <IconButton onClick={()=> deleteWorkerFromTask(el?._id)}>
                  <Delete color="error"/>
                </IconButton>
              </li>
            ))}
            <li className="flex items-center gap-2 cursor-pointer"   onClick={()=>{
              handleOpen()
              setModalUserId(manager?._id)
            }
              }>
              <img
                className="w-[26px] rounded-md"
                src={`${BACKEND_URL}/${manager?.img}`}
              />
              {manager?.fullname}
            </li>
          </ul>
          <UserModal open={open} setOpen={setOpen} handleClose={handleClose} handleOpen={handleOpen} user={modalUserId == manager?._id ? manager : task?.workers.find(e=> e._id == modalUserId)}/>
          <ul className="chatWraps-setting">
            {/* <li>Guruh a'zolarini o'chirish</li>
            <li>Yangi hodim qo'shish</li> */}
            <li>Qorong'u rejim</li>
          </ul>
        </div>
        <div className="chatWrapsMain">
          <div className="chatWrapsMain-header">
            <h3>{chatData?.chatName}</h3>
            <p>{task?.workers?.length + 1} ta a'zo</p>
          </div>
          <div className="chatWrapsMain-body">
            {messages?.map((el, idx) => {
              const isOwnMessage = el?.sender?._id === manager?._id;

              if (el?.file) {
                const fileExtension = el?.file?.split(".").pop().toLowerCase();
                console.log(fileExtension);
                if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
                  // Render image
                  return (
                    <div className="muContentWraper w-[200px]" key={idx}>
                      <div
                        className={`chatContentWraper px-6 ${
                          el?.sender?._id === managerData?._id
                            ? "myContentWrap"
                            : ""
                        }`}
                      >
                        <h6>{el?.sender?.fullname}</h6>
                        <img
                          src={`${BACKEND_URL}/${el.file}`}
                          alt="File"
                          className="rounded-md max-h-[250px]"
                        />
                        <div className="date flex flex-col justify-end items-end">
                          <small className="ms-4 text-[9px]">
                            {formatDateToCustom(el?.createdAt)}
                          </small>
                          <small className="ms-4 text-[7px]">
                            {getFormattedTimeFromDate(el?.createdAt)}
                          </small>
                        </div>
                        {isOwnMessage && (
                <div className="btns">
                  <IconButton onClick={() => deleteMessage(el?._id)}>
                    <Delete color="error" />
                  </IconButton>
                </div>
              )}
                      </div>
                    </div>
                  );
                } else if (["mp4", "avi", "mov"].includes(fileExtension)) {
                  // Render video
                  return (
                    <div className="muContentWraper w-[250px]" key={idx}>
                      <div
                        className={`chatContentWraper px-6 ${
                          el?.sender?._id === managerData?._id
                            ? "myContentWrap"
                            : ""
                        }`}
                      >
                        <h6>{el?.sender?.fullname}</h6>
                        <video controls className="rounded-md max-h-[250px]">
                          <source
                            src={`${BACKEND_URL}/${el.file}`}
                            type={`video/${fileExtension}`}
                          />
                          Your browser does not support the video tag.
                        </video>
                        <div className="date flex flex-col justify-end items-end">
                          <small className="ms-4 text-[9px]">
                            {formatDateToCustom(el?.createdAt)}
                          </small>
                          <small className="ms-4 text-[7px]">
                            {getFormattedTimeFromDate(el?.createdAt)}
                          </small>
                        </div>
                        {isOwnMessage && (
                <div className="btns">
                  <IconButton onClick={() => deleteMessage(el?._id)}>
                    <Delete color="error" />
                  </IconButton>
                </div>
              )}
                      </div>
                    </div>
                  );
                } else if (["pdf", "doc", "docx"].includes(fileExtension)) {
                  // Render PDF or Word document
                  return (
                    <div className="muContentWraper w-[250px]" key={idx}>
                      <div
                        className={`chatContentWraper px-6 ${
                          el?.sender?._id === managerData?._id
                            ? "myContentWrap"
                            : ""
                        }`}
                      >
                        <h6>{el?.sender?.fullname}</h6>
                        <a
                          href={`${BACKEND_URL}/${el?.file}`}
                          download={el?.file}
                        >
                          Download {fileExtension.toUpperCase()} File
                        </a>
                        <div className="date flex flex-col justify-end items-end">
                          <small className="ms-4 text-[9px]">
                            {formatDateToCustom(el?.createdAt)}
                          </small>
                          <small className="ms-4 text-[7px]">
                            {getFormattedTimeFromDate(el?.createdAt)}
                          </small>
                        </div>
                        {isOwnMessage && (
                <div className="btns">
                  <IconButton onClick={() => deleteMessage(el?._id)}>
                    <Delete color="error" />
                  </IconButton>
                </div>
              )}
                      </div>
                    </div>
                  );
                } else {
                  // Render other file types (ZIP, etc.)
                  return (
                    <div className="muContentWraper w-[250px]" key={idx}>
                      <div
                        className={`chatContentWraper px-6 ${
                          el?.sender?._id === managerData?._id
                            ? "myContentWrap"
                            : ""
                        }`}
                      >
                        <h6>{el?.sender?.fullname}</h6>
                        <a
                          href={`${BACKEND_URL}/${el.file}`}
                          download={el.file}
                        >
                          Yuklab olish {fileExtension?.toUpperCase()} File
                        </a>
                        <div className="date flex flex-col justify-end items-end">
                          <small className="ms-4 text-[9px]">
                            {formatDateToCustom(el?.createdAt)}
                          </small>
                          <small className="ms-4 text-[7px]">
                            {getFormattedTimeFromDate(el?.createdAt)}
                          </small>
                        </div>
                        {isOwnMessage && (
                <div className="btns">
                  <IconButton onClick={() => deleteMessage(el?._id)}>
                    <Delete color="error" />
                  </IconButton>
                </div>
              )}
                      </div>
                    </div>
                  );
                }
              }else {
                return (
              <div className="muContentWraper w-[200px]" key={idx}>
                <div
                  className={`chatContentWraper px-6 ${
                    el?.sender?._id === managerData?._id ? "myContentWrap" : ""
                  }`}
                >
                  <h6>{el?.sender?.fullname}</h6>
                  
           

                  <li className={`myContent chatContent`}>{el?.message}</li>
                  <div className="date flex flex-col justify-end items-end">
                        <small className="ms-4 text-[9px]">
                          {formatDateToCustom(el?.createdAt)}
                        </small>
                        <small className="ms-4 text-[7px]">
                          {getFormattedTimeFromDate(el?.createdAt)}
                        </small>
                      </div>
                      <small >
                      </small>
                     
                      {isOwnMessage && (
                <div className={`btns`} >

                  <IconButton onClick={() => deleteMessage(el?._id)}>
                    <Delete color="error" />
                  </IconButton>
                </div>
              )}
                </div>
              </div>

                )
              }


              {
                /* if (el?.sender?._id == workerData?._id) {
                return (
                  <div className="muContentWraper " key={idx}>
                    <div className={`chatContentWraper px-6 myContentWrap`}>
                      <h6>{el?.sender?.fullname}</h6>
                      <li className={`myContent chatContent`}>{el?.message}</li>
                      <div className="date flex flex-col justify-end items-end">
                        <small className="ms-4 text-[9px]">
                          {formatDateToCustom(el?.createdAt)}
                        </small>
                        <small className="ms-4 text-[7px]">
                          {getFormattedTimeFromDate(el?.createdAt)}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="muContentWraper">
                    <div className="chatContentWraper px-6 ">
                      <h6>{el?.sender?.fullname}</h6>
                      <li className="chatContent myContent">{el?.message}</li>
                      <div className="date flex flex-col justify-end items-end">
                        <small className="ms-4 text-[9px]">
                          {formatDateToCustom(el?.createdAt)}
                        </small>
                        <small className="ms-4 text-[7px]">
                          {getFormattedTimeFromDate(el?.createdAt)}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              } */
              }
            })}
          </div>
          <div className="chatWrapsMain-footer ">
            <div className="wrapper">
              <div className="file-upload">
                <input
                  type="file"
                  accept=".pdf, .doc, .docx, .zip, .rar, .jpg, .jpeg, .png, .gif, .mp4, .mov"
                  onChange={(e) => handleFileChange(e)}
                />
                <i className="fa fa-arrow-up"></i>
              </div>
            </div>
            <div className="chatWrapsMain-footer-inputW">
              <input
                type="text"
                placeholder="Yozing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="chatWrapsMain-footer-send" onClick={sendMessage}>
              <i className="fas fa-paper-plane"></i>
            </div>
          </div>
        </div>
        <div className="chatWraps">
          <div>
            <h3>{task?.title}</h3>
            <p>{task?.desc}</p>
          </div>
        </div>
      </div>
      <div ref={messageRef}></div>
    </>
  );
};

export default Chats;
