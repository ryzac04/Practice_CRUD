import API from "./apiClient"; 
import type { User } from "../types/user"; 

export async function getUsers() {
    const res = await API.get<User[]>("/users");
    return res.data; 
}

export async function getUser(id: number) {
    const res = await API.get<User>(`/users/${id}`);
    return res.data; 
}

// "Partial<User>" means an object that may contain some subset of User fields. 
export async function updateUser(id: number, body: Partial<User>) {
    const res = await API.patch<User>(`/users/${id}`, body);
    return res.data; 
}

export async function deleteUser(id: number) {
    await API.delete(`/users/${id}`);
}