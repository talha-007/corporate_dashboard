import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import employeeServices from 'src/redux/api/employeeServices';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Corporate {
  companyName: string;
}

export type UserProps = {
  _id: Key | null | undefined;
  employeeName: string;
  email: string;
  mobile: string;
  corporateId?: Corporate; // Optional if it can be null or undefined
  department: string;
  hotelLimit: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectRow: () => void;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  refetch,
  setRefetch,
}: UserTableRowProps) {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = async () => {
    try {
      const res = await employeeServices.deleteEmployee(row._id);
      if (res.status === 200) {
        toast.success(res.data.message);
        handleClosePopover();
        setRefetch(!refetch);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.employeeName}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.mobile}</TableCell>
        <TableCell>{row?.corporateId?.companyName}</TableCell>
        <TableCell>{row?.department}</TableCell>
        <TableCell>{row?.hotelLimit}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              navigate(`/employees/edit/${row._id}`);
              handleClosePopover();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
