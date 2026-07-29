import api from "./api";

export interface RegisterRequest {
    full_name: string;
    email: string;
    password: string;
}

export const register = async (
    data: RegisterRequest,
) => {
    const response = await api.post(
        "/auth/register",
        data,
    );

    return response.data;
};