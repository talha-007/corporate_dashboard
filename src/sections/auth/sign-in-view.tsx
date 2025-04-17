import { useState } from 'react';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useAppDispatch } from 'src/hooks';
import { adminLogin } from 'src/redux/services/authSlice';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const initialValues = {
  email: '',
  password: '',
};

export function SignInView() {
  const dispatch = useAppDispatch();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
    validations({ [name]: value });
  };
  const validations = (fieldValue = values) => {
    const temp = { ...errors };

    if ('email' in fieldValue) temp.email = fieldValue.email ? '' : 'This Field is Required';
    if ('password' in fieldValue)
      temp.password = fieldValue.password ? '' : 'This Field is Required';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = async () => {
    const datas = { ...values };
    try {
      const res = await dispatch(adminLogin(datas)).unwrap(); // <- unwrap gives you the actual payload or throws
      if (res.token) {
        toast.success(res.message);
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="email"
        label="Email address"
        defaultValue="hello@gmail.com"
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        onChange={handleChange}
        value={values.email}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
        onChange={handleChange}
        value={values.password}
        error={Boolean(errors.password)}
        helperText={errors.password}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSubmit}
      >
        Sign in
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Sign in</Typography>
      </Box>
      {renderForm}
    </>
  );
}
