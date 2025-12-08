import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const fetchTransactions = async (params) => {
  const res = await API.get("/transactions", { params });
  return res.data;
};

export const fetchTransactionById = async (id) => {
  const res = await API.get(`/transactions/${id}`);
  return res.data;
};
