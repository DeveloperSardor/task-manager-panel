import React from 'react'
import { Close } from '@mui/icons-material'
import { Box } from '@mui/material'


const UserBadgeItem = ({ user, handleFunction }) => {
  return (
   <Box
   px={2}
   py={1}
   borderRadius="lg"
       m={1}
       mb={2}
       variant="solid"
       fontSize={12}
       bgcolor={'purple'}
       color={'white'}
       cursor="pointer"
       onClick={handleFunction}
   >
   {user?.fullname}
   <Close sx={{ pl : "5px", cursor : "pointer"}}/>
   </Box>
  )
}

export default UserBadgeItem
