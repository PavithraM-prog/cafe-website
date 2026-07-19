"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Loader2, X, Phone, MapPin, ExternalLink, RefreshCw, Compass } from "lucide-react";

// Coordinates for Cozy Beans Cafe
const CAFE_COORDS: [number, number] = [13.0827, 80.1748];

export default function InteractiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const cafeMarkerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // States
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isAnimationTriggered, setIsAnimationTriggered] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routingInfo, setRoutingInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [routingError, setRoutingError] = useState<string | null>(null);

  // 1. Initialize Map (Client-Side Only)
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || mapRef.current) return;

    // Create Leaflet Map Instance
    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629], // Center of India (starts wide)
      zoom: 3.5,
      zoomControl: false, // Positioned at bottomright later, after animations
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
    });

    mapRef.current = map;

    // Detect Theme for initial tile layer
    const isDark = document.documentElement.classList.contains("dark");
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const tiles = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tiles;

    // Add Zoom Control at bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    setIsMapInitialized(true);

    // Cleanup on Unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Watch for dark/light mode toggle via MutationObserver
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateTiles = () => {
      if (!tileLayerRef.current) return;
      const isDark = document.documentElement.classList.contains("dark");
      const nextTileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
      
      tileLayerRef.current.setUrl(nextTileUrl);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateTiles();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Check system preference if no explicit class
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      // Only change if class is not set
      if (!document.documentElement.classList.contains("dark") && 
          !document.documentElement.classList.contains("light")) {
        updateTiles();
      }
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // 3. Viewport Intersection Observer to Trigger Animation
  useEffect(() => {
    if (!isMapInitialized || !mapRef.current || isAnimationTriggered) return;

    const target = containerRef.current;
    if (!target) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          triggerCameraFlyIn();
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
    });

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapInitialized, isAnimationTriggered]);

  // 4. Smooth Camera Fly-In Animation
  const triggerCameraFlyIn = () => {
    if (!mapRef.current || isAnimationTriggered) return;
    setIsAnimationTriggered(true);

    const map = mapRef.current;

    // Fly camera smoothly from world to Cozy Beans Cafe over 3 seconds
    map.flyTo(CAFE_COORDS, 17, {
      duration: 3.0,
      easeLinearity: 0.2,
    });

    // Handle post-animation actions
    setTimeout(() => {
      setIsAnimationComplete(true);

      // Re-enable interactions after animation finishes
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
      if (map.tapHold) map.tapHold.enable();

      // Drop cafe marker and draw initial route
      dropCafeMarker();
      drawDefaultRoute();
    }, 3000);
  };

  // 5. Custom Cafe Marker Drop & Animate
  const dropCafeMarker = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Pre-create custom coffee cup icon SVG
    const coffeeCupSvg = `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <filter id="marker-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#4A2C2A" flood-opacity="0.35"/>
        </filter>
        <!-- Base Pin -->
        <path d="M50,92 Q50,92 20,48 A32,32 0 1,1 80,48 Q50,92 50,92 Z" fill="#4A2C2A" filter="url(#marker-shadow)" />
        <!-- Inner Circle -->
        <circle cx="50" cy="48" r="21" fill="#FFF8E7" />
        <!-- Coffee Cup Inside -->
        <g transform="translate(36, 33) scale(0.68)" fill="#4A2C2A">
          <!-- Cup body -->
          <path d="M5 6 H30 L27 25 C26.5 28 24 30 20 30 H15 C11 30 8.5 28 8 25 Z" />
          <!-- Handle -->
          <path d="M29 10 C34 10 36 12 36 15 C36 18 34 20 29 20" fill="none" stroke="#4A2C2A" stroke-width="3.5" stroke-linecap="round"/>
          <!-- Steam -->
          <path d="M12 -2 Q14 -7 12 -12" fill="none" stroke="#D9A441" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M18 -1 Q20 -6 18 -11" fill="none" stroke="#D9A441" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M24 -2 Q26 -7 24 -12" fill="none" stroke="#D9A441" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </svg>
    `;

    const customIcon = L.divIcon({
      className: "custom-cafe-icon-wrapper",
      iconSize: [48, 48],
      iconAnchor: [24, 48], // Align anchor to bottom-center of marker
      popupAnchor: [0, -46], // Position popup above the marker
      html: `
        <div class="custom-cafe-marker">
          <div class="pulse-ring"></div>
          <div id="coffee-cup-marker-element" class="w-12 h-12 marker-drop-bounce">
            ${coffeeCupSvg}
          </div>
        </div>
      `,
    });

    const marker = L.marker(CAFE_COORDS, { icon: customIcon }).addTo(map);
    cafeMarkerRef.current = marker;

    // After the drop/bounce CSS animation completes, transition to floating animation
    setTimeout(() => {
      const markerEl = document.getElementById("coffee-cup-marker-element");
      if (markerEl) {
        markerEl.classList.remove("marker-drop-bounce");
        markerEl.classList.add("marker-floating");
      }
    }, 950);

    // Setup Custom Popup Content
    const popupHtml = `
      <div class="p-5 font-sans space-y-4 text-left">
        <div class="flex items-center space-x-2">
          <span class="text-xl">☕</span>
          <h4 class="font-serif text-base font-bold text-[#4A2C2A] dark:text-[#F6ECE2] leading-none">Cozy Beans Cafe</h4>
        </div>
        
        <p class="text-xs text-[#7A635B] dark:text-[#B39D97] leading-relaxed flex items-start space-x-1.5">
          <span class="text-[#D9A441] mt-0.5 shrink-0">📍</span>
          <span>AKC, Mogappair,<br/>Nerkundram, Chennai,<br/>Tamil Nadu 600107</span>
        </p>
        
        <div class="flex items-center space-x-1.5 text-xs text-[#7A635B] dark:text-[#B39D97]">
          <span class="text-[#D9A441]">⭐</span>
          <span class="font-semibold text-[#4A2C2A] dark:text-[#F6ECE2]">Open Daily:</span>
          <span>7:00 AM - 9:00 PM</span>
        </div>
        
        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6DDD0] dark:border-[#2D1B18]">
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Cozy+Beans+Cafe+AKC+Mogappair+Nerkundram+Chennai"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center space-x-1 rounded-lg bg-[#4A2C2A] dark:bg-[#D9A441] hover:opacity-90 text-white text-[10px] font-bold py-2 px-2.5 transition-all text-center"
          >
            <span>Open in Maps</span>
            <span class="text-[9px]">↗</span>
          </a>
          <button 
            id="popup-get-directions-btn"
            class="flex items-center justify-center space-x-1 rounded-lg bg-[#FFF8E7] dark:bg-[#1F1210] border border-[#E6DDD0] dark:border-[#2D1B18] hover:bg-[#F5EFE6] dark:hover:bg-[#2D1B18] text-[#4A2C2A] dark:text-[#F6ECE2] text-[10px] font-bold py-2 px-2 transition-all"
          >
            <span>Get Directions</span>
          </button>
        </div>
        
        <a 
          href="tel:+15557892699"
          class="flex items-center justify-center space-x-1 w-full text-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#4A2C2A] dark:text-[#F6ECE2] text-[10px] font-bold py-2 transition-all"
        >
          <span>📞 Call Cafe (+1 555-789-COZY)</span>
        </a>
      </div>
    `;

    marker.bindPopup(popupHtml);

    // Event delegation on popup open to wire directions button
    map.on("popupopen", (e) => {
      const popupNode = e.popup.getElement();
      if (popupNode) {
        const dirBtn = popupNode.querySelector("#popup-get-directions-btn");
        if (dirBtn) {
          dirBtn.addEventListener("click", (evt) => {
            evt.preventDefault();
            marker.closePopup();
            handleLocateAndDrawRoute();
          });
        }
      }
    });

    // Auto-open info window shortly after drop completes
    setTimeout(() => {
      marker.openPopup();
    }, 1100);
  };

  // 6. Draw Default Animated Route (Nearby junction to Cafe)
  const drawDefaultRoute = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
    }

    // Default route from Mogappair West Bus Terminus area
    const defaultRoute: [number, number][] = [
      [13.0805, 80.1650], // Mogappair West Bus Terminus
      [13.0811, 80.1682], // Mogappair Road Junction
      [13.0818, 80.1712], // School Road junction
      [13.0822, 80.1735], // Near Cafe lane
      [13.0827, 80.1748], // Cozy Beans Cafe
    ];

    const polyline = L.polyline(defaultRoute, {
      color: "#D9A441",
      weight: 5,
      opacity: 0.85,
      lineCap: "round",
      lineJoin: "round",
      className: "route-line-animated",
    }).addTo(map);

    routePolylineRef.current = polyline;
  };

  // 7. Get Driving Directions from Visitor Location (OSRM API)
  const handleLocateAndDrawRoute = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setRoutingError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoadingLocation(true);
    setRoutingError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        setUserLocation([userLat, userLng]);

        if (!mapRef.current) return;
        const map = mapRef.current;

        // Draw "You are here" user marker
        drawUserMarker(userLat, userLng);

        try {
          // Fetch driving route coordinates and metrics from OSRM
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${CAFE_COORDS[1]},${CAFE_COORDS[0]}?overview=full&geometries=geojson`;
          const response = await fetch(osrmUrl);
          if (!response.ok) throw new Error("Could not fetch route from routing server.");
          const data = await response.json();

          if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
            throw new Error("No route found between coordinates.");
          }

          const route = data.routes[0];
          const distKm = (route.distance / 1000).toFixed(1);
          const durationMins = Math.round(route.duration / 60);

          setRoutingInfo({
            distance: `${distKm} km`,
            duration: `${durationMins} mins`,
          });

          // Extract geojson geometry coordinates: arrays of [lng, lat]
          const routeCoords: [number, number][] = route.geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );

          // Clear default / old route line
          if (routePolylineRef.current) {
            routePolylineRef.current.remove();
          }

          // Draw real animated route
          const polyline = L.polyline(routeCoords, {
            color: "#D9A441",
            weight: 5.5,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
            className: "route-line-animated",
          }).addTo(map);

          routePolylineRef.current = polyline;

          // Adjust map bounds to display both markers with padding
          const bounds = L.latLngBounds([[userLat, userLng], CAFE_COORDS]);
          map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 16,
            animate: true,
            duration: 1.5,
          });

        } catch (err: any) {
          console.error("OSRM directions error:", err);
          setRoutingError("Failed to calculate driving route. Drawing direct path.");
          
          // Draw direct fallback straight line
          if (routePolylineRef.current) {
            routePolylineRef.current.remove();
          }
          const fallbackPolyline = L.polyline([[userLat, userLng], CAFE_COORDS], {
            color: "#EF4444",
            weight: 4,
            dashArray: "8, 8",
            className: "route-line-animated",
          }).addTo(map);
          routePolylineRef.current = fallbackPolyline;

          const bounds = L.latLngBounds([[userLat, userLng], CAFE_COORDS]);
          map.fitBounds(bounds, { padding: [40, 40] });
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setRoutingError("Location request was denied. Please check permission settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            setRoutingError("Location details are temporarily unavailable.");
            break;
          case error.TIMEOUT:
            setRoutingError("Location request timed out. Please try again.");
            break;
          default:
            setRoutingError("An unknown location error occurred.");
        }
      },
      { timeout: 10000 }
    );
  };

  // Helper to draw user location dot on map
  const drawUserMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: "user-marker-wrapper",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      html: `
        <div class="user-marker">
          <div class="user-marker-pulse"></div>
          <div class="user-marker-dot"></div>
        </div>
      `,
    });

    const marker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    userMarkerRef.current = marker;

    marker.bindPopup(`
      <div class="p-3 font-sans text-center text-xs">
        <p class="font-bold text-[#3B82F6]">You Are Here</p>
      </div>
    `);
  };

  // 8. Clear current user route and reset to default
  const handleClearRoute = () => {
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    setUserLocation(null);
    setRoutingInfo(null);
    setRoutingError(null);
    drawDefaultRoute();

    if (mapRef.current) {
      mapRef.current.setView(CAFE_COORDS, 17, {
        animate: true,
        duration: 1.0,
      });
      // Re-open cafe popup
      if (cafeMarkerRef.current) {
        cafeMarkerRef.current.openPopup();
      }
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden group/map select-none bg-secondary/30">
      {/* 1. Leaflet Container */}
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-1000 ${
          isAnimationTriggered ? "opacity-100 map-fade-in" : "opacity-0"
        }`}
      />

      {/* 2. Custom Loader Overlay (shown until map mounts and finishes initialization) */}
      {!isMapInitialized && (
        <div className="absolute inset-0 bg-[#F5EFE6] dark:bg-[#1B100E] z-30 flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center">
            {/* Spinning ring */}
            <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-accent animate-spin" />
            <span className="absolute text-xl">☕</span>
          </div>
          <p className="font-serif text-sm font-bold text-primary dark:text-[#F6ECE2] tracking-wide animate-pulse">
            Pouring Cozy Map...
          </p>
        </div>
      )}

      {/* 3. Locator Controls Floating Panel */}
      {isAnimationComplete && (
        <>
          {/* Locative Quick Button */}
          <button
            onClick={handleLocateAndDrawRoute}
            disabled={isLoadingLocation}
            title="Directions from my location"
            className="absolute top-2.5 right-2.5 z-[400] p-2.5 rounded-full bg-white/95 dark:bg-[#1B100E]/95 border border-[#E6DDD0]/60 dark:border-[#2D1B18]/60 shadow-lg text-primary dark:text-[#F6ECE2] hover:text-accent dark:hover:text-accent hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Compass className="w-5 h-5" />
            )}
          </button>

          {/* Routing Overlay Card */}
          {(routingInfo || routingError || isLoadingLocation) && (
            <div className="absolute top-2.5 left-2.5 z-[400] max-w-[260px] w-[calc(100%-20px)] rounded-2xl bg-white/95 dark:bg-[#1B100E]/95 border border-[#E6DDD0]/60 dark:border-[#2D1B18]/60 p-4 shadow-xl backdrop-blur-sm animate-slideDown">
              <div className="flex items-start justify-between mb-2">
                <h5 className="text-xs font-bold text-primary dark:text-[#F6ECE2] flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5 text-accent animate-pulse" />
                  <span>Driving Route</span>
                </h5>
                <button
                  onClick={handleClearRoute}
                  className="p-1 rounded-full text-textMuted dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {isLoadingLocation && (
                <div className="flex items-center space-x-2 py-2">
                  <Loader2 className="w-4 h-4 text-accent animate-spin" />
                  <p className="text-[11px] text-textMuted dark:text-neutral-400">Finding your path...</p>
                </div>
              )}

              {routingError && !isLoadingLocation && (
                <p className="text-[11px] text-red-500 font-medium leading-relaxed">{routingError}</p>
              )}

              {routingInfo && !isLoadingLocation && (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/40 dark:bg-secondary/10 rounded-xl p-2.5 border border-[#E6DDD0]/35 dark:border-[#2D1B18]/30">
                      <p className="text-[9px] uppercase tracking-wider text-textMuted dark:text-neutral-400">Est. Time</p>
                      <p className="text-sm font-bold text-primary dark:text-[#F6ECE2] mt-0.5">{routingInfo.duration}</p>
                    </div>
                    <div className="bg-secondary/40 dark:bg-secondary/10 rounded-xl p-2.5 border border-[#E6DDD0]/35 dark:border-[#2D1B18]/30">
                      <p className="text-[9px] uppercase tracking-wider text-textMuted dark:text-neutral-400">Distance</p>
                      <p className="text-sm font-bold text-primary dark:text-[#F6ECE2] mt-0.5">{routingInfo.distance}</p>
                    </div>
                  </div>
                  <p className="text-[9.5px] text-textMuted dark:text-neutral-400 leading-normal">
                    Route calculated from your current location via street network. Drive safely!
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
