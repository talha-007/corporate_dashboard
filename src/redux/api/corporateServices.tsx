import { callAPi } from './http-common';

interface addCorporate {
  companyName: string;
  contactPerson: string;
  designation: string;
  contactNumber: string;
  email: string;
  address: string;
  departments: Array<string>;
}

const addCorporate = (data: addCorporate) => callAPi.post('/api/corporates/add', data);
const editCorporate = (id: string, data: addCorporate) =>
  callAPi.put(`/api/corporates/update/${id}`, data);
const deleteCorporate = (id: string) => callAPi.delete(`/api/corporates/delete/${id}`);
const getCorporate = () => callAPi.get('/api/corporates/get');
const getCorporatebyId = (id: string) => callAPi.get(`/api/corporates/getById/${id}`);

const corporateServices = {
  addCorporate,
  editCorporate,
  deleteCorporate,
  getCorporate,
  getCorporatebyId,
};

export default corporateServices;
