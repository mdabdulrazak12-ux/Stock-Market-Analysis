window.App = {
    stocksArray: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'],
    activeSymbol: null,
    data: {
        charts: null,
        stats: null,
        profiles: null
    },

    async bootstrap() {
        try {
            ChartSection.init();

            // Fetch all application datasets concurrently
            const [charts, stats, profiles] = await Promise.all([
                APIService.fetchCharts(),
                APIService.fetchStats(),
                APIService.fetchProfiles()
            ]);

            this.data.charts = charts;
            this.data.stats = stats;
            this.data.profiles = profiles;

            // Render the right sidebar panel catalog list items
            ListSection.render(this.stocksArray);

            // Set default view target initialization to the first stock index
            const fallbackDefault = this.stocksArray[0];
            const firstActiveElementNode = document.querySelector('.stock-card-element');
            
            if (firstActiveElementNode) {
                ListSection.selectStock(firstActiveElementNode, fallbackDefault);
            }

        } catch (err) {
            console.error("Dashboard boot cycle interrupted by API mapping variations:", err);
            document.getElementById('stock-items-container').innerHTML = `
                <div style="color:#ef4444; text-align:center; padding: 20px 0; font-size:0.9rem;">
                    API Connectivity Sync Issue. Please refresh your browser.
                </div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.App.bootstrap();
});
