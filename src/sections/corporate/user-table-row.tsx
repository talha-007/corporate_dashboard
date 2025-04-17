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

import corporateServices from 'src/redux/api/corporateServices';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface UserProps {
  _id: string;
  companyName: string;
  contactPerson: string;
  designation: string;
  contactNumber: string;
  emailId: string;
  address: string; // Add the 'address' property
  departments: string[]; // Assuming 'departments' is an array of strings
}

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
      const res = await corporateServices.deleteCorporate(row._id);
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

        <TableCell>{row.companyName}</TableCell>

        <TableCell>{row.contactPerson}</TableCell>
        <TableCell>{row.designation}</TableCell>
        <TableCell>{row.contactNumber}</TableCell>
        <TableCell>{row.emailId}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>
          {row.departments.map((dept, index) => (
            <p key={index} style={{ margin: 0 }}>
              {dept}
            </p>
          ))}
        </TableCell>

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
              navigate(`/corporates/edit/${row._id}`);
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
