// /scripts/dashboard.js
// Dashboard with vanilla canvas charts

import { drivers, analyticsData } from './mock-data.js';

let currentSort = { column: 'ontime', direction: 'desc' };

// Initialize dashboard
function initDashboard() {
  renderDeliveriesChart();
  renderEmissionsChart();
  renderDriversTable();
  setupTableSorting();
}

// Draw line chart for deliveries
function renderDeliveriesChart() {
  const canvas = document.getElementById('deliveries-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const data = analyticsData.dailyDeliveries;

  // Chart dimensions
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Find min/max values
  const values = data.map(d => d.count);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;

  // Draw grid lines
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Draw axes
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Draw Y-axis labels
  ctx.fillStyle = '#9ca3af';
  ctx.font = '12px Arial';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const value = Math.round(minValue + (range / 5) * (5 - i));
    const y = padding + (chartHeight / 5) * i;
    ctx.fillText(value.toString(), padding - 10, y + 4);
  }

  // Draw line
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 3;
  ctx.beginPath();

  data.forEach((point, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index;
    const normalizedValue = (point.count - minValue) / range;
    const y = height - padding - normalizedValue * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw points
  data.forEach((point, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index;
    const normalizedValue = (point.count - minValue) / range;
    const y = height - padding - normalizedValue * chartHeight;

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw X-axis labels (every 3rd date)
  ctx.fillStyle = '#9ca3af';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  data.forEach((point, index) => {
    if (index % 3 === 0) {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const date = new Date(point.date);
      const label = `${date.getDate()}/${date.getMonth() + 1}`;
      ctx.fillText(label, x, height - padding + 20);
    }
  });
}

// Draw bar chart for CO2 emissions
function renderEmissionsChart() {
  const canvas = document.getElementById('emissions-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const data = analyticsData.co2ByRoute;

  // Chart dimensions
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Find max value
  const maxValue = Math.max(...data.map(d => d.co2));

  // Draw grid lines
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Draw axes
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Draw Y-axis labels
  ctx.fillStyle = '#9ca3af';
  ctx.font = '12px Arial';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((maxValue / 5) * (5 - i));
    const y = padding + (chartHeight / 5) * i;
    ctx.fillText(value + 'g', padding - 10, y + 4);
  }

  // Draw bars
  const barWidth = chartWidth / data.length * 0.7;
  const barSpacing = chartWidth / data.length;

  data.forEach((item, index) => {
    const x = padding + barSpacing * index + (barSpacing - barWidth) / 2;
    const barHeight = (item.co2 / maxValue) * chartHeight;
    const y = height - padding - barHeight;

    // Gradient fill
    const gradient = ctx.createLinearGradient(x, y, x, height - padding);
    gradient.addColorStop(0, '#4f46e5');
    gradient.addColorStop(1, '#06b6d4');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw value on top
    ctx.fillStyle = '#e5e7eb';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(item.co2 + 'g', x + barWidth / 2, y - 5);

    // Draw label
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px Arial';
    ctx.save();
    ctx.translate(x + barWidth / 2, height - padding + 15);
    ctx.rotate(-Math.PI / 6);
    ctx.textAlign = 'right';
    ctx.fillText(item.route, 0, 0);
    ctx.restore();
  });
}

// Render drivers table
function renderDriversTable() {
  const tbody = document.getElementById('drivers-tbody');
  if (!tbody) return;

  // Sort drivers
  const sortedDrivers = [...drivers].sort((a, b) => {
    const aVal = a[currentSort.column] || 0;
    const bVal = b[currentSort.column] || 0;

    if (currentSort.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  tbody.innerHTML = '';

  sortedDrivers.forEach(driver => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${driver.name}</td>
      <td>${driver.rating.toFixed(1)} ⭐</td>
      <td><span class="badge badge-success">${driver.onTimePercent.toFixed(1)}%</span></td>
      <td><span class="badge badge-info">${driver.ecoScore.toFixed(1)}</span></td>
      <td>₹${driver.earnings.toLocaleString('en-IN')}</td>
    `;
    tbody.appendChild(row);
  });
}

// Setup table sorting
function setupTableSorting() {
  const headers = document.querySelectorAll('#drivers-table th[data-sort]');
  
  headers.forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const column = header.getAttribute('data-sort');
      
      if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort.column = column;
        currentSort.direction = 'desc';
      }

      renderDriversTable();

      // Update header indicators
      headers.forEach(h => {
        h.textContent = h.textContent.replace(' ▲', '').replace(' ▼', '');
      });
      
      header.textContent += currentSort.direction === 'asc' ? ' ▲' : ' ▼';
    });
  });
}

// Initialize when page loads
if (document.querySelector('.dashboard-page')) {
  initDashboard();
}
