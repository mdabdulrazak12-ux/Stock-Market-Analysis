const ListSection = {
    render(symbolsList) {
        const listWrapper = document.getElementById('stock-items-container');
        listWrapper.innerHTML = '';

        symbolsList.forEach(symbol => {
            const stat = window.App.data.stats[symbol];
            if (!stat) return;

            const profitMetric = stat.profit;
            const item = document.createElement('div');
            item.className = 'stock-card-element';
            item.setAttribute('data-symbol', symbol);

            // Task Rule: Dynamic color assignment logic based on profit values
            const profitClass = profitMetric > 0 ? 'profit-green' : 'profit-red';
            const formattedProfit = profitMetric.toFixed(2);

            item.innerHTML = `
                <span class="symbol-txt">${symbol}</span>
                <div class="metrics-block">
                    <div>$${stat.bookValue.toFixed(2)}</div>
                    <div class="${profitClass}">${profitMetric > 0 ? '+' : ''}${formattedProfit}%</div>
                </div>
            `;

            item.addEventListener('click', () => {
                this.selectStock(item, symbol);
            });

            listWrapper.appendChild(item);
        });
    },

    selectStock(elementNode, symbol) {
        document.querySelectorAll('.stock-card-element').forEach(el => el.classList.remove('active-item'));
        elementNode.classList.add('active-item');

        window.App.activeSymbol = symbol;
        document.getElementById('selected-stock-title').textContent = symbol;

        ChartSection.updateChart(symbol);
        DetailSection.render(symbol);
    }
};
