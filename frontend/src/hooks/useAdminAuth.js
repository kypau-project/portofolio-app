import { useCallback, useEffect, useState } from "react";
import { getMe } from "@/lib/api";

export function useAdminAuth() {
    const [state, setState] = useState({ loading: true, authed: false, username: null });

    const check = useCallback(async () => {
        const token = localStorage.getItem("kypau_token");
        if (!token) {
            setState({ loading: false, authed: false, username: null });
            return false;
        }
        try {
            const me = await getMe();
            setState({ loading: false, authed: true, username: me.username });
            return true;
        } catch {
            localStorage.removeItem("kypau_token");
            setState({ loading: false, authed: false, username: null });
            return false;
        }
    }, []);

    useEffect(() => {
        check();
    }, [check]);

    const logout = useCallback(() => {
        localStorage.removeItem("kypau_token");
        setState({ loading: false, authed: false, username: null });
    }, []);

    return { ...state, check, logout };
}
