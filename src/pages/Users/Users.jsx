import { useState, useEffect, useRef } from "react";
import { Box, Typography, useTheme, Button, Backdrop } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { ArrowBackIos, ArrowLeft, BackHand, BackHandOutlined, BackHandSharp, Backspace, Delete, Edit, Upload } from "@mui/icons-material";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import toast from "react-hot-toast";
import axios from "axios";
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const [fileState, setFileState] = useState(null);

    const managerData = JSON.parse(localStorage.getItem("managerData"));

    const [workers, setWorkers] = useState([]);
    const [imgLoad, setImgLoad] = useState(false);


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFileState(selectedFile);
        console.log(fileState);
        setImgLoad(true);
        setTimeout(() => {
          setImgLoad(false);
        }, 1100);
        toast.success();
      };

      async function GetWorkers(req, res) {
        try {
          const { data } = await axios.get(`${BACKEND_URL}/api/users`);
          const newArray = data?.data.map((obj, index) => {
            return { ...obj, id: index + 1 };
          });
    
          setWorkers(newArray);
        } catch (error) {
          toast.error(error.message);
        }
      }



      const columns = [
        { field : "id", headerName: "ID", flex: 0.3  },
        {
            field: "fullname",
            headerName: "FIO",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "img",
            headerName: "Rasm",
            width: 100,
            renderCell: (params) => (
              <img
                src={`${BACKEND_URL}/${params.row.img}`}
                alt="image"
                style={{
                  width: 42,
                  height: 42,
                  objectFit: "cover",
                  borderRadius: 50,
                }}
              />
            ),
          },
          {
            field: "email",
            headerName: "email",
            headerAlign: "left",
            align: "left",
            flex: 1.3,
          },
          {
            field: "raiting",
            headerName: "Reyting",
            headerAlign: "left",
            align: "left",
            flex: 1.3,
          },
          {
            field: "actions",
            headerName: "Actions",
            width: 120,
            renderCell: (params) => (
              <>
                <IconButton
                  color="secondary"
                  onClick={() => handleEdit(params?.row?._id)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(params?.row?._id)}
                >
                  <Delete />
                </IconButton>
              </>
            ),
          },
      ]

      const handleEdit = (id) => {
        const row = workers?.find((row) => row._id === id);
        setSelectedRow({
          ...row,
        });
        setOpenDialog(true);
      };

      const handleSave = ()=>{
        const updateRows = workers?.map(async (row) => {
            if (row._id === selectedRow._id) {
              // return selectedRow;
              try  {
                const formData = new FormData();
                formData.append("fullname", selectedRow.fullname);
                formData.append("email", selectedRow.email);
                fileState && formData.append("file", fileState);
                const { data } = await axios.put(
                  `${BACKEND_URL}/api/users/edit-worker/${selectedRow._id}`,
                  formData,
                  { headers: { token: managerData?.token } }
                );
                if (data.success) {
                  toast.success(data.message);
                  GetWorkers();    
                } else {
                  throw new Error(data.message);
                }
              } catch (error) {
                toast.error(error.message);
              }
            }
            return row;
          });
          setOpenDialog(false)
      }

      const handleCancel = () => {
        setOpenDialog(false);
      };

      
      const handleDelete = async (id) => {
        try {
          const { data } = await axios.delete(`${BACKEND_URL}/api/users/${id}`, {
            headers: { token: managerData?.token },
          });
          if (data?.success) {
            toast.success(data?.message);
            GetWorkers();
          } else {
            throw new Error(data?.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      };

      useEffect(()=>{
         GetWorkers();
      }, [])

    return (
    <Box p={'25px'} height={'100vh'} bgcolor={'rgba(250, 235, 215, 0.701)'} color={'#fff'}>
    <IconButton onClick={()=> navigate('/')}>
        <ArrowBackIos/>
    </IconButton>
        <Box
        m={"2em 0 0 0"}
        height={"75vh"}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            // color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            // backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            // backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            // backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            // color: `${colors.grey[100]} !important`,
            color : "#fff"
          },
        }}
      >
         <DataGrid
          editMode="row"
          components={{ Toolbar: GridToolbar }}
          rows={workers}
          onCellDoubleClick={handleEdit}
          columns={columns}
          sx={{ width: "100%" }}
        />
        <Dialog open={openDialog} onClose={handleCancel}>
            <DialogTitle>Ishchi malumotini o'zgartirish</DialogTitle>
            <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1.1em",
              p: "2em",
              width: "500px",
            }}
          >
            <input
              type="text"
              value={selectedRow?.fullname || ""}
              className="form-control"
              style={{
                borderRadius: "6px",
                paddingLeft: "12px",
                paddingRight: "12px",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
              onChange={(e) =>
                setSelectedRow({ ...selectedRow, fullname: e.target.value })
              }
            />
            <input
              type="email"
              className="form-control"
              value={selectedRow?.email || ""}
              style={{
                borderRadius: "6px",
                paddingLeft: "12px",
                paddingRight: "12px",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
              onChange={(e) =>
                setSelectedRow({ ...selectedRow, email: e.target.value })
              }
            />
            <label
              class="custom-upload"
              style={{
                alignItems: "center",
                cursor: "pointer",
                justifyContent: "start",
                display: "flex",
              }}
            >
              <span class="file-name rounded-3 p-3 px-4 border text-center">
                <img
                  src={`${BACKEND_URL}/${selectedRow?.img}`}
                  alt="rasm"
                  style={{
                    width: "45px",
                    height: "42px",
                    borderRadius: "35px",
                  }}
                />
              </span>
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <b
                class="ms-2"
                style={{ color: 'blue', marginLeft: "10px" }}
              >
                Rasmni yangilash
              </b>
            </label>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Bekor qilish
            </Button>
            <Button onClick={handleSave} color="primary">
              Saqlash
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default Users
