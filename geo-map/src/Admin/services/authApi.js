import { apiRequest } from "../../services/api";

export async function loginAdmin(email, password) {
    const response = await apiRequest("/login.php", {
        method: "POST",
        body: { email, password },
    });

    return response.user;
}
