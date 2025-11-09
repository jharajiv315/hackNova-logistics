// /scripts/tracking.js
// Real-time tracking simulation with animated markers

import { shipments } from './mock-data.js';
import { showToast } from './components.js';

let activeShipments = [...shipments];
let selectedShipmentId = null;
let animationInterval = null;

// Marker position tracking (percentage along route)
const markerProgress = {};

// Initialize tracking page
function initTracking() {
  renderShipmentList();
  renderMarkers();
  startAnimation();
  setupFilters();
}

// Render shipment list in sidebar
function renderShipmentList() {
  const listContainer = document.getElementById('shipment-list');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  activeShipments.forEach(shipment => {
    const card = document.createElement('div');
    card.className = 'shipment-card';
    card.setAttribute('data-shipment-id', shipment.id);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    
    const statusBadgeClass = 
      shipment.status === 'delivered' ? 'badge-success' :
      shipment.status === 'out-for-delivery' ? 'badge-info' :
      'badge-warning';

    card.innerHTML = `
      <div class="shipment-header">
        <span class="tracking-id">${shipment.trackingId}</span>
        <span class="badge ${statusBadgeClass}">${shipment.status}</span>
      </div>
      <div class="shipment-route">
        ${shipment.sender.city} → ${shipment.receiver.city}
      </div>
      <div class="shipment-eta">
        ETA: ${formatTime(shipment.estimatedArrival)}
      </div>
    `;

    card.addEventListener('click', () => selectShipment(shipment.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectShipment(shipment.id);
      }
    });

    listContainer.appendChild(card);
  });
}

// Render markers on map
function renderMarkers() {
  const markersLayer = document.getElementById('markers-layer');
  if (!markersLayer) return;

  markersLayer.innerHTML = '';

  activeShipments.forEach(shipment => {
    // Initialize progress if not exists
    if (!(shipment.id in markerProgress)) {
      markerProgress[shipment.id] = 0;
    }

    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.setAttribute('data-marker-id', shipment.id);
    
    const markerClass = 
      shipment.status === 'delivered' ? 'marker-delivered' :
      shipment.status === 'out-for-delivery' ? 'marker-delivery' :
      'marker-transit';

    marker.innerHTML = `<div class="marker-dot ${markerClass}"></div>`;
    
    // Set initial position
    updateMarkerPosition(marker, shipment);
    
    markersLayer.appendChild(marker);
  });
}

// Update marker position based on progress
function updateMarkerPosition(marker, shipment) {
  const progress = markerProgress[shipment.id] || 0;
  const coords = shipment.routeCoords;
  
  if (coords.length < 2) return;

  // Calculate position along route
  const totalSegments = coords.length - 1;
  const segmentProgress = progress * totalSegments;
  const currentSegment = Math.floor(segmentProgress);
  const segmentFraction = segmentProgress - currentSegment;

  if (currentSegment >= totalSegments) {
    // Reached destination
    const lastCoord = coords[coords.length - 1];
    marker.style.left = `${lastCoord.x}px`;
    marker.style.top = `${lastCoord.y}px`;
    return;
  }

  // Interpolate between two points
  const start = coords[currentSegment];
  const end = coords[currentSegment + 1];
  
  const x = start.x + (end.x - start.x) * segmentFraction;
  const y = start.y + (end.y - start.y) * segmentFraction;

  marker.style.left = `${x}px`;
  marker.style.top = `${y}px`;
}

// Animation loop
function startAnimation() {
  if (animationInterval) clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    activeShipments.forEach(shipment => {
      if (shipment.status === 'delivered') return;

      // Increment progress
      markerProgress[shipment.id] = (markerProgress[shipment.id] || 0) + 0.01;

      // Check for status transitions
      if (markerProgress[shipment.id] >= 0.8 && shipment.status === 'in-transit') {
        shipment.status = 'out-for-delivery';
        showToast(`Shipment ${shipment.trackingId} is out for delivery!`, 'info');
        updateShipmentCard(shipment.id);
      }

      if (markerProgress[shipment.id] >= 1 && shipment.status !== 'delivered') {
        shipment.status = 'delivered';
        showToast(`Shipment ${shipment.trackingId} has been delivered!`, 'success');
        updateShipmentCard(shipment.id);
      }

      // Update marker position
      const marker = document.querySelector(`[data-marker-id="${shipment.id}"]`);
      if (marker) {
        updateMarkerPosition(marker, shipment);
        
        // Update marker class based on status
        const dot = marker.querySelector('.marker-dot');
        dot.className = 'marker-dot';
        if (shipment.status === 'delivered') {
          dot.classList.add('marker-delivered');
        } else if (shipment.status === 'out-for-delivery') {
          dot.classList.add('marker-delivery');
        } else {
          dot.classList.add('marker-transit');
        }
      }
    });
  }, 1000);
}

// Update shipment card UI
function updateShipmentCard(shipmentId) {
  const card = document.querySelector(`[data-shipment-id="${shipmentId}"]`);
  if (!card) return;

  const shipment = activeShipments.find(s => s.id === shipmentId);
  if (!shipment) return;

  const badge = card.querySelector('.badge');
  badge.className = 'badge';
  
  if (shipment.status === 'delivered') {
    badge.classList.add('badge-success');
  } else if (shipment.status === 'out-for-delivery') {
    badge.classList.add('badge-info');
  } else {
    badge.classList.add('badge-warning');
  }
  
  badge.textContent = shipment.status;
}

// Select/focus shipment
function selectShipment(shipmentId) {
  selectedShipmentId = shipmentId;

  // Update card UI
  document.querySelectorAll('.shipment-card').forEach(card => {
    card.classList.remove('active');
    if (card.getAttribute('data-shipment-id') === shipmentId) {
      card.classList.add('active');
    }
  });

  // Focus marker (pseudo-zoom with scale)
  document.querySelectorAll('.marker').forEach(marker => {
    if (marker.getAttribute('data-marker-id') === shipmentId) {
      marker.style.transform = 'translate(-50%, -50%) scale(1.5)';
      marker.style.zIndex = '10';
    } else {
      marker.style.transform = 'translate(-50%, -50%) scale(1)';
      marker.style.zIndex = '1';
    }
  });
}

// Setup search and filters
function setupFilters() {
  const searchInput = document.getElementById('shipment-search');
  const statusFilter = document.getElementById('status-filter');
  const cityFilter = document.getElementById('city-filter');

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', applyFilters);
  }

  if (cityFilter) {
    cityFilter.addEventListener('change', applyFilters);
  }
}

function applyFilters() {
  const searchQuery = document.getElementById('shipment-search')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('status-filter')?.value || 'all';
  const cityFilter = document.getElementById('city-filter')?.value || 'all';

  activeShipments = shipments.filter(shipment => {
    // Search filter
    const matchesSearch = 
      shipment.trackingId.toLowerCase().includes(searchQuery) ||
      shipment.sender.city.toLowerCase().includes(searchQuery) ||
      shipment.receiver.city.toLowerCase().includes(searchQuery);

    // Status filter
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;

    // City filter
    const matchesCity = 
      cityFilter === 'all' ||
      shipment.sender.city === cityFilter ||
      shipment.receiver.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  renderShipmentList();
  renderMarkers();
}

// Utility: Format time
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Initialize when page loads
if (document.querySelector('.tracking-page')) {
  initTracking();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (animationInterval) {
    clearInterval(animationInterval);
  }
});
