const ChartSection = {
    timeRange: '1mo',

    init() {
        const buttons = document.querySelectorAll('.range-selector');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.timeRange = e.target.getAttribute('data-range');
                
                if (window.App && window.App.activeSymbol) {
                    this.updateChart(window.App.activeSymbol);
                }
            });
        });
    },

    updateChart(symbol) {
        const stockData = window.App.data.charts[symbol];
        if (!stockData || !stockData[this.timeRange]) return;

        const rangeData = stockData[this.timeRange];
        const values = rangeData.value;
        const timestamps = rangeData.timeStamp;

        // Peak / Low functionality tasks metrics tracking calculation
        const peak = Math.max(...values);
        const low = Math.min(...values);
        
        document.getElementById('peak-price').textContent = `$${peak.toFixed(2)}`;
        document.getElementById('low-price').textContent = `$${low.toFixed(2)}`;
        
        const closePrice = values[values.length - 1];
        document.getElementById('current-stock-price-display').textContent = `$${closePrice.toFixed(2)}`;

        // Convert timestamps into localized string formats
        const dateLabels = timestamps.map(ts => new Date(ts * 1000).toLocaleDateString());

        // Target rendering workspace canvas element node
        const canvas = document.getElementById('stockVolumeChart');
        const ctx = canvas.getContext('2d');

        // Dynamically scale canvas rendering dimensions based on its layout container bounding box
        const rect = canvas.parentNode.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = 380 * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.drawNativeChart(ctx, rect.width, 380, values, dateLabels, symbol);
    },

    // Pure HTML5 Canvas rendering engine framework pipeline
    drawNativeChart(ctx, width, height, data, labels, symbol) {
        // Clear old frame buffer completely before redrawing
        ctx.clearRect(0, 0, width, height);

        const paddingLeft = 60;
        const paddingRight = 20;
        const paddingTop = 30;
        const paddingBottom = 40;

        const graphWidth = width - paddingLeft - paddingRight;
        const graphHeight = height - paddingTop - paddingBottom;

        const minVal = Math.min(...data);
        const maxVal = Math.max(...data);
        const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

        // 1. Draw horizontal dashboard grid guidelines
        ctx.strokeStyle = '#252e3f';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#667085';
        ctx.font = '11px sans-serif';

        const gridLines = 4;
        for (let i = 0; i <= gridLines; i++) {
            const y = paddingTop + (graphHeight * i / gridLines);
            const priceLabel = maxVal - ((valRange * i) / gridLines);

            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - paddingRight, y);
            ctx.stroke();

            // Render price text along the Y-axis margins
            ctx.fillText(`$${priceLabel.toFixed(1)}`, 10, y + 4);
        }

        // 2. Plot stock trajectory trendline paths mapping array data coordinates
        if (data.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = '#2f80ed'; // Blue brand matching theme requirements
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        data.forEach((val, index) => {
            const x = paddingLeft + (index / (data.length - 1)) * graphWidth;
            const y = paddingTop + graphHeight - ((val - minVal) / valRange) * graphHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // 3. Draw clean X-Axis temporal milestone data timeline labels
        ctx.fillStyle = '#667085';
        const labelStep = Math.max(1, Math.floor(labels.length / 4));
        
        labels.forEach((label, index) => {
            if (index % labelStep === 0 || index === labels.length - 1) {
                const x = paddingLeft + (index / (labels.length - 1)) * graphWidth;
                const y = height - paddingBottom + 20;

                ctx.save();
                ctx.translate(x, y);
                ctx.textAlign = 'center';
                ctx.fillText(label, 0, 0);
                ctx.restore();
            }
        });
    }
};
