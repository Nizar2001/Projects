"use client";
import { useEffect } from "react";
import { TOKEN_KEY } from "../src/utils/constants";
import api from "../src/utils/api";

export default function GuestSessionInit() {
    useEffect(() => {
        const CreateGuestSession = async () => {
            if (localStorage.getItem(TOKEN_KEY)) return;
            try {
                const res = await api.get("/api/users/guest-session");
                const data = res.data;
                localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
                // Store guest user ID if present
                if (data.user_id) {
                    sessionStorage.setItem("guest_user_id", data.user_id);
                }
            } catch {
                console.log("Error creating guest session.");
            }
        };
        CreateGuestSession();
    }, []);
    return null;
}