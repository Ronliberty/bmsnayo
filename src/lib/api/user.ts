import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAccount(access: string) {
  const res = await axios.get(`${API_URL}/api/user/me/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return res.data;
}

export async function updateAccount(access: string, data: { email?: string; phone?: string }) {
  const res = await axios.put(`${API_URL}/api/auth/account/`, data, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return res.data;
}

export async function changePassword(access: string, data: { oldPassword: string; newPassword: string }) {
  const res = await axios.post(`${API_URL}/api/pass/change/`, data, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return res.data;
}

export async function deleteAccount(access: string) {
  return axios.delete(`${API_URL}/api/auth/delete-account/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
}
