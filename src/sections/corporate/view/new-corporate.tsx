import type { SelectChangeEvent } from '@mui/material';

import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  CardHeader,
  IconButton,
  InputLabel,
  CardActions,
  FormControl,
  OutlinedInput,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import corporateServices from 'src/redux/api/corporateServices';

import { Iconify } from 'src/components/iconify';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const departments = [
  { name: 'HR', value: 'HR' },
  { name: 'Finance', value: 'Finance' },
  { name: 'IT', value: 'IT' },
  { name: 'Sales', value: 'Sales' },
  { name: 'Marketing', value: 'Marketing' },
  { name: 'Operations', value: 'Operations' },
  { name: 'Support', value: 'Support' },
  { name: 'Admin', value: 'Admin' },
];
// Define the structure of the form values
interface FormValues {
  companyName: string;
  contactPerson: string;
  designation: string;
  contactNumber: string;
  email: string;
  address: string;
  departments: Array<string>;
}

// Define the structure of the errors object
interface FormErrors {
  companyName: string;
  contactPerson: string;
  designation: string;
  contactNumber: string;
  email: string;
  address: string;
  departments: string;
}

// Initial values for the form
const initialValues: FormValues = {
  companyName: '',
  email: '',
  contactNumber: '',
  contactPerson: '',
  departments: [],
  address: '',
  designation: '',
};

const NewCorporate = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDepartments, setDepartments] = useState<string[]>([]);

  const handleSelect = (event: SelectChangeEvent<typeof isDepartments>) => {
    const {
      target: { value },
    } = event;
    setDepartments(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
    validations({ [name]: value });
  };

  const validations = (fieldValue: Partial<FormValues> = values) => {
    const temp: FormErrors = { ...errors };

    if ('companyName' in fieldValue)
      temp.companyName = fieldValue.companyName ? '' : 'This Field is Required';
    if ('designation' in fieldValue)
      temp.designation = fieldValue.designation ? '' : 'This Field is Required';
    if ('address' in fieldValue) temp.address = fieldValue.address ? '' : 'This Field is Required';

    if ('email' in fieldValue) {
      if (!fieldValue.email) {
        temp.email = 'This Field is Required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue.email)) {
        temp.email = 'Enter a valid email';
      } else {
        temp.email = '';
      }
    }

    if ('contactNumber' in fieldValue) {
      if (!fieldValue.contactNumber) {
        temp.contactNumber = 'This Field is Required';
      } else if (!/^\d+$/.test(fieldValue.contactNumber)) {
        temp.contactNumber = 'Only numbers are allowed';
      } else {
        temp.contactNumber = '';
      }
    }

    if ('contactPerson' in fieldValue)
      temp.contactPerson = fieldValue.contactPerson ? '' : 'This Field is Required';
    temp.departments = isDepartments.length > 0 ? '' : 'Please select at least one department';
    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = async () => {
    const datas = {
      ...values,
      departments: isDepartments,
      emailId: values.email,
    };
    if (validations()) {
      try {
        setIsLoading(true);
        const res = await corporateServices.addCorporate(datas);
        console.log('res', res);
        if (res.status === 201) {
          toast.success(res?.data?.message);
          navigate(-1);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error adding corporate:', error);
        setIsLoading(false);
      }
    }
  };

  return (
    <DashboardContent>
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: isLoading ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <CircularProgress />
        </Box>
        <CardHeader
          title="Add Corporate"
          action={
            <IconButton aria-label="settings" onClick={() => navigate(-1)}>
              <Iconify icon="solar:arrow-left-bold" />
            </IconButton>
          }
          sx={{ pb: 3 }}
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              name="companyName"
              onChange={handleChange}
              value={values.companyName}
              error={Boolean(errors.companyName)}
              helperText={errors.companyName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Contact Person"
              variant="outlined"
              name="contactPerson"
              onChange={handleChange}
              value={values.contactPerson}
              error={Boolean(errors.contactPerson)}
              helperText={errors.contactPerson}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Designation"
              variant="outlined"
              name="designation"
              onChange={handleChange}
              value={values.designation}
              error={Boolean(errors.designation)}
              helperText={errors.designation}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Contact Number"
              variant="outlined"
              name="contactNumber"
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = e.target.value;
                // Allow only numbers and limit to 10 digits
                if (/^\d{0,10}$/.test(value)) {
                  handleChange(e);
                }
              }}
              value={values.contactNumber}
              error={Boolean(errors.contactNumber)}
              helperText={errors.contactNumber}
              inputProps={{
                maxLength: 10,
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Email ID"
              variant="outlined"
              name="email"
              onChange={handleChange}
              value={values.email}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth error={Boolean(errors.departments)}>
              <InputLabel id="demo-multiple-name-label">Select Departments</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={isDepartments}
                name="departments"
                onChange={handleSelect}
                input={<OutlinedInput label="Select Departments" />}
                MenuProps={MenuProps}
              >
                {departments?.map((item) => (
                  <MenuItem key={item.value} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.departments}</FormHelperText>
              {console.log('isDepartments', errors.departments)}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              name="address"
              onChange={handleChange}
              value={values.address}
              error={Boolean(errors.address)}
              helperText={errors.address}
              rows={4}
              multiline
            />
          </Grid>
        </Grid>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
            Add
          </Button>
        </CardActions>
      </Card>
    </DashboardContent>
  );
};

export default NewCorporate;
