import axios from "axios";

const API = axios.create({
  baseURL: "https://truestate2.vercel.app/api",
});

export const fetchTransactions = async (params) => {
  const res = await API.get("/transactions", { params });
  return res.data;
};

export const fetchTransactionById = async (id) => {
  const res = await API.get(`/transactions/${id}`);
  return res.data;
};
