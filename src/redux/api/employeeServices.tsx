import { callAPi } from './http-common';

interface addEmployee {
  employeeName: string;
  email: string;
  mobile: string;
  employeeId: string;
  department: string;
  hotelLimit: string;
}

const addEmployee = (data: addEmployee) => callAPi.post('/api/employees/add', data);
const editEmployee = (id: string, data: addEmployee) =>
  callAPi.put(`/api/employees/update/${id}`, data);
const deleteEmployee = (id: string) => callAPi.delete(`/api/employees/delete/${id}`);
const getEmployees = () => callAPi.get('/api/employees/get');
const getCorporatesForEmployees = () => callAPi.get('/api/employees/getCorporates');
const getEmployeebyId = (id: string) => callAPi.get(`/api/employees/getById/${id}`);

const employeeServices = {
  addEmployee,
  editEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeebyId,
  getCorporatesForEmployees,
};

export default employeeServices;
