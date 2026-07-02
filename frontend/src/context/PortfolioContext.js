import React, { createContext, useContext, useEffect, useState } from "react";
import { getPortfolio, trackVisit } from "@/lib/api";

const PortfolioContext = createContext(null);
export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        getPortfolio()
            .then((d) => {
                if (mounted) setData(d);
            })
            .catch((e) => {
                if (mounted) setError(e);
            })
            .finally(() => mounted && setLoading(false));
        // track a visit (fire and forget)
        trackVisit("/").catch(() => {});
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <PortfolioContext.Provider value={{ data, loading, error }}>{children}</PortfolioContext.Provider>
    );
};
