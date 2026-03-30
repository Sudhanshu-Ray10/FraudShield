"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Radar } from "lucide-react";

// Dynamically import react-globe.gl to prevent SSR issues with WebGL/window
const Globe = dynamic(() => import("react-globe.gl"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-zinc-900/50">
       <Radar className="w-8 h-8 text-primary animate-pulse" />
       <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Loading Neural-INT Map...</span>
    </div>
  )
});

export interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

export interface RingData {
  lat: number;
  lng: number;
  color: string;
}

interface CyberGlobeProps {
  arcs: ArcData[];
  rings: RingData[];
}

export function CyberGlobe({ arcs, rings }: CyberGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const globeRef = useRef<any>();

  useEffect(() => {
    // Automatically resize the WebGL canvas to fit the CSS grid container perfectly
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    
    // Set initial size
    setDimensions({ 
       width: containerRef.current.offsetWidth, 
       height: containerRef.current.offsetHeight 
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Spin the globe continuously and set initial camera position
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 1.5;
      globeRef.current.pointOfView({ altitude: 2.2 });
    }
  }, [dimensions.width]); // Re-apply when dimension settles

  return (
    <div className="w-full aspect-square relative rounded-xl border border-primary/20 bg-black/40 overflow-hidden group shadow-[0_0_30px_-5px_rgba(245,158,11,0.1)]">
      
      {/* HUD Overlay Details */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
        <h4 className="text-xs font-semibold text-primary/80 uppercase tracking-widest flex items-center gap-1.5 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]">
          <Radar className="w-3.5 h-3.5 text-primary animate-pulse" /> Global GEO-INT
        </h4>
        <p className="text-[10px] text-zinc-500 font-mono">Live Threat Radar Active</p>
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 uppercase">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-status-fraud shadow-[0_0_5px_rgba(239,68,68,0.8)]" /> Fraud</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-status-safe shadow-[0_0_5px_rgba(34,197,94,0.8)]" /> Safe</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-status-warning shadow-[0_0_5px_rgba(245,158,11,0.8)]" /> Warn</span>
        </div>
      </div>

      {/* Crosshairs Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 border-[0.5px] border-primary/30 border-dashed rounded-full scale-90 group-hover:scale-100 transition-transform duration-700" />
      <div className="absolute top-1/2 left-0 right-0 h-[0.5px] bg-primary/20 pointer-events-none z-10" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-primary/20 pointer-events-none z-10" />
      
      {/* 3D Global Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-crosshair">
        {dimensions.width > 0 && typeof window !== "undefined" && (
          <Globe
            // @ts-expect-error
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            // Arcs Configuration
            arcsData={arcs}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={1500}
            arcStroke={0.6}
            // Rings Configuration
            ringsData={rings}
            ringColor="color"
            ringMaxRadius={8}
            ringPropagationSpeed={2.5}
            ringRepeatPeriod={1500}
            // Point Configuration (Server Fixed Loc)
            pointsData={[{ lat: 37.7749, lng: -122.4194 }]}
            pointColor={() => "#f59e0b"}
            pointAltitude={0.05}
            pointRadius={0.5}
          />
        )}
      </div>
    </div>
  );
}
