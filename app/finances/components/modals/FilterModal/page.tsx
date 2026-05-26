import { Box, Button, Modal, Paper, } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import { useState } from "react";
import { Filters } from "../../Filters/page";

export const FilterModal = () => {
  
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button onClick={() => setOpen(true)}>
        <SortIcon className="md:hidden!"/>
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} className="flex justify-center items-center">
          <Box component={Paper} className="flex justify-center items-center w-[70%]">
            <Filters setIsOpen={setOpen} />
          </Box>
      </Modal>
    </Box>
  );
};
