import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const UserModal = ({ open, setOpen, handleOpen, handleClose, user }) => {
  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
       <Typography className='font-bold' fontWeight={'500'}>
       {user?.fullname}
       </Typography> 
       <Typography>
        Lavozim : {user?.position == 'worker' ? "Ishchi" : "Manager"}
       </Typography>
       <Typography>
        Email : {user?.email}
       </Typography>
      </Typography>

    </Box>
  </Modal>
  )
}

export default UserModal
