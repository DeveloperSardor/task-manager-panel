import React from 'react'
import { Avatar } from '@mui/material'
import { Box, Typography } from '@mui/material'


const UserListItem = ({ user, handleFunction }) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  return (
    <Box
     onClick={handleFunction}
    //   cursor="pointer"
      sx={{ cursor : "pointer", "&:hover" : { background : "#38B2AC", color : "white" } }}
      bgcolor={'#E8E8E8'}
      width="30%"
    display={'flex'}
      alignItems="center"
      color="black"
       height={'35px'}
    //   px={3}
      py={'40px'}
      px={'15px'}
    //   py={2}
      mb={2}
      borderRadius={'14px'}
    >
      <Avatar
        className='w-[35px] mr-2'
        src={`${BACKEND_URL}/${user?.img}`}
      />
      <Box>
        <Typography color={'black'}>{user?.fullname}</Typography>
        <Typography>
            <b  color='black'>Reyting: </b>
            {user?.raiting}
        </Typography>
      </Box>
    </Box>
  )
}

export default UserListItem
