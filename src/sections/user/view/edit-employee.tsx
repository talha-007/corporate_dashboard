import type { RootState } from 'src/redux/store';

import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  Grid,
  Button,
  MenuItem,
  TextField,
  CardHeader,
  IconButton,
  CardActions,
  CircularProgress,
} from '@mui/material';

import { useAppDispatch } from 'src/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import employeeServices from 'src/redux/api/employeeServices';
import {
  fetchEmployeeById,
  fetchAllCorporatesForEmployees,
} from 'src/redux/services/employeeSlice';

import { Iconify } from 'src/components/iconify';

// Define the structure of the form values
interface FormValues {
  employeeName: string;
  email: string;
  mobile: string;
  employeeId: string;
  department: string;
  hotelLimit: string;
  corporateId: string;
}

// Define the structure of the errors object
interface FormErrors {
  employeeName?: string;
  email?: string;
  mobile?: string;
  employeeId?: string;
  department?: string;
  hotelLimit?: string;
  corporateId?: string;
}

// Initial values for the form
const initialValues: FormValues = {
  employeeName: '',
  email: '',
  mobile: '',
  employeeId: '',
  department: '',
  hotelLimit: '',
  corporateId: '',
};

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const { corporates, employee } = useSelector((state: RootState) => state?.employee);

  useEffect(() => {
    dispatch(fetchAllCorporatesForEmployees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (employee) {
      setValues({
        employeeName: employee?.employeeName,
        email: employee?.email,
        mobile: employee?.mobile,
        employeeId: employee?.employeeId,
        department: employee?.department,
        hotelLimit: employee?.hotelLimit,
        corporateId: employee?.corporateId?._id || '',
      });
      const selectedCorporate = corporates.find((corp) => corp._id === employee?.corporateId?._id);
      setDepartments(selectedCorporate?.departments || []);
    }
  }, [employee, corporates]);
  console.log('employee', employee);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues({
      ...values,
      [name]: value,
    });

    // Update departments when corporateId changes
    if (name === 'corporateId') {
      const selectedCorporate = corporates.find((corp) => corp._id === value);
      setValues({
        ...values,
        corporateId: value,
        department: '', // Reset department when corporate changes
      });
      setDepartments(selectedCorporate?.departments || []);
    }

    validations({ [name]: value });
  };

  const validations = (fieldValue: Partial<FormValues> = values) => {
    const temp: FormErrors = { ...errors };

    if ('employeeName' in fieldValue)
      temp.employeeName = fieldValue.employeeName ? '' : 'This Field is Required';

    if ('email' in fieldValue) {
      if (!fieldValue.email) {
        temp.email = 'This Field is Required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue.email)) {
        temp.email = 'Enter a valid email';
      } else {
        temp.email = '';
      }
    }

    if ('mobile' in fieldValue) {
      if (!fieldValue.mobile) {
        temp.mobile = 'This Field is Required';
      } else if (!/^\d+$/.test(fieldValue.mobile)) {
        temp.mobile = 'Only numbers are allowed';
      } else {
        temp.mobile = '';
      }
    }

    if ('employeeId' in fieldValue)
      temp.employeeId = fieldValue.employeeId ? '' : 'This Field is Required';

    if ('corporateId' in fieldValue)
      temp.corporateId = fieldValue.corporateId ? '' : 'This Field is Required';
    if ('department' in fieldValue)
      temp.department = fieldValue.department ? '' : 'This Field is Required';

    if ('hotelLimit' in fieldValue)
      temp.hotelLimit = fieldValue.hotelLimit ? '' : 'This Field is Required';

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = async () => {
    const datas = {
      ...values,
    };
    if (validations()) {
      try {
        setIsLoading(true);
        const res = await employeeServices.editEmployee(id ?? '', datas);
        console.log('res', res);
        if (res.status === 200) {
          toast.success(res?.data?.message);
          navigate(-1);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error adding employee:', error);
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
          title="Edit Employee"
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
              label="Name"
              variant="outlined"
              name="employeeName"
              onChange={handleChange}
              value={values.employeeName}
              error={Boolean(errors.employeeName)}
              helperText={errors.employeeName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              name="email"
              onChange={handleChange}
              value={values.email}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              name="mobile"
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = e.target.value;
                // Allow only numbers and limit to 10 digits
                if (/^\d{0,10}$/.test(value)) {
                  handleChange(e);
                }
              }}
              value={values.mobile}
              error={Boolean(errors.mobile)}
              helperText={errors.mobile}
              inputProps={{
                maxLength: 10,
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              label="ID"
              variant="outlined"
              name="employeeId"
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = e.target.value;
                // Allow only numbers and limit to 10 digits
                if (/^\d{0,10}$/.test(value)) {
                  handleChange(e);
                }
              }}
              value={values.employeeId}
              error={Boolean(errors.employeeId)}
              helperText={errors.employeeId}
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
              select
              label="Corporate"
              variant="outlined"
              name="corporateId"
              onChange={handleChange}
              value={values.corporateId}
              error={Boolean(errors.corporateId)}
              helperText={errors.corporateId}
            >
              {corporates?.map((option) => (
                <MenuItem key={option?._id} value={option?._id}>
                  {option?.companyName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              select
              label="Department"
              variant="outlined"
              name="department"
              onChange={handleChange}
              value={values.department}
              error={Boolean(errors.department)}
              helperText={errors.department}
            >
              {departments.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Hotel Limit"
              variant="outlined"
              name="hotelLimit"
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = e.target.value;
                // Allow only numbers and limit to 10 digits
                if (/^\d{0,10}$/.test(value)) {
                  handleChange(e);
                }
              }}
              value={values.hotelLimit}
              error={Boolean(errors.hotelLimit)}
              helperText={errors.hotelLimit}
              inputProps={{
                maxLength: 10,
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />
          </Grid>
        </Grid>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
            Save
          </Button>
        </CardActions>
      </Card>
    </DashboardContent>
  );
};

export default EditEmployee;
