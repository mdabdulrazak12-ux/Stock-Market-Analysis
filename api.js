const API_ENDPOINTS = {
    chartsData: "https://stock-market-api-k9vl.onrender.com/api/stocksdata",
    statsData: "https://stock-market-api-k9vl.onrender.com/api/stocksstatsdata",
    profileSummary: "https://stock-market-api-k9vl.onrender.com/api/profiledata"
};

const APIService = {
    async fetchCharts() {
        const res = await fetch(API_ENDPOINTS.chartsData);
        const json = await res.json();
        // The API wraps everything inside an array under 'stocksData'
        return json.stocksData[0]; 
    },
    async fetchStats() {
        const res = await fetch(API_ENDPOINTS.statsData);
        const json = await res.json();
        // The API wraps stats under 'stocksStatsData'
        return json.stocksStatsData[0];
    },
    async fetchProfiles() {
        const res = await fetch(API_ENDPOINTS.profileSummary);
        const json = await res.json();
        // The profile data endpoint nests companies inside a 'stocksProfileData' object
        return json.stocksProfileData[0];
    }
};
