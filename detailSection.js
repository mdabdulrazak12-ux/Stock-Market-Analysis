const DetailSection = {
    render(symbol) {
        const stats = window.App.data.stats[symbol];
        const profile = window.App.data.profiles[symbol];

        if (!stats) return;

        document.getElementById('company-name-title').textContent = symbol;
        document.getElementById('company-book-val').textContent = `$${stats.bookValue.toFixed(2)}`;
        
        const profit = stats.profit;
        const profitNode = document.getElementById('company-profit-val');
        profitNode.textContent = `${profit.toFixed(2)}%`;

        if (profit > 0) {
            profitNode.className = 'profit-green';
        } else {
            profitNode.className = 'profit-red';
        }

        const summaryBody = document.getElementById('company-summary-text');
        if (profile) {
            summaryBody.textContent = typeof profile === 'string' ? profile : (profile.summary || profile.description || "Overview statement metrics unmapped.");
        } else {
            summaryBody.textContent = "Data tracking details are currently unavailable in the central profile registry.";
        }
    }
};
