import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  url?: string;
  title?: string;
  description?: string;
  markdown?: string;
  lat?: number;
  lng?: number;
}

interface SexOffenderMapProps {
  onResultsUpdate?: (results: SearchResult[], registries: SearchResult[], disclaimer: string) => void;
}

const MAPBOX_TOKEN = 'pk.placeholder'; // Will be fetched from edge function

export default function SexOffenderMap({ onResultsUpdate }: SexOffenderMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Fetch the Mapbox token from the edge function
  useEffect(() => {
    const fetchToken = async () => {
      const { data, error } = await supabase.functions.invoke('sex-offender-search', {
        body: { action: 'get-mapbox-token' },
      });
      if (!error && data?.token) {
        setMapToken(data.token);
      } else {
        toast({ title: 'Map error', description: 'Could not load map token.', variant: 'destructive' });
      }
    };
    fetchToken();
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283], // Center of US
      zoom: 4,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapReady(true);
    });

    // Search on map move (debounced)
    let moveTimeout: NodeJS.Timeout;
    map.current.on('moveend', () => {
      if (!mapReady) return;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        const center = map.current?.getCenter();
        const zoom = map.current?.getZoom();
        if (center && zoom && zoom >= 8) {
          searchByCoordinates(center.lat, center.lng);
        }
      }, 1000);
    });

    return () => {
      clearTimeout(moveTimeout);
      map.current?.remove();
      map.current = null;
    };
  }, [mapToken]);

  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  };

  const addMarkers = (results: SearchResult[]) => {
    clearMarkers();
    results.forEach((r) => {
      if (r.lat && r.lng && map.current) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="max-width:250px">
            <strong style="font-size:14px">${r.title || 'Registry Result'}</strong>
            <p style="font-size:12px;margin-top:4px;color:#666">${(r.description || '').substring(0, 150)}</p>
            ${r.url ? `<a href="${r.url}" target="_blank" rel="noopener" style="font-size:12px;color:#2563eb">View Details →</a>` : ''}
          </div>`
        );

        const marker = new mapboxgl.Marker({ color: '#dc2626' })
          .setLngLat([r.lng, r.lat])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);
      }
    });
  };

  const searchByAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast({ title: 'Enter an address', description: 'Please enter a zip code or address to search.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      // Geocode the address using Mapbox
      const geoRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapToken}&country=us&limit=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.features?.length) {
        toast({ title: 'Location not found', description: 'Could not find that address. Try a zip code.', variant: 'destructive' });
        return;
      }

      const [lng, lat] = geoData.features[0].center;
      const placeName = geoData.features[0].place_name;

      // Fly to location
      map.current?.flyTo({ center: [lng, lat], zoom: 12, duration: 1500 });

      // Search for offenders near this location
      await searchByCoordinates(lat, lng, placeName);
    } catch (err) {
      toast({ title: 'Search failed', description: String(err), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const searchByCoordinates = async (lat: number, lng: number, placeName?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sex-offender-search', {
        body: { action: 'map-search', lat, lng, placeName },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      const results = data.results || [];
      addMarkers(results);
      onResultsUpdate?.(results, data.officialRegistries || [], data.disclaimer || '');

      if (results.length === 0) {
        toast({ title: 'No results', description: 'No registry records found in this area. Try zooming out or searching a different location.' });
      } else {
        toast({ title: 'Search complete', description: `Found ${results.length} results in this area.` });
      }
    } catch (err) {
      console.error('Map search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <form onSubmit={searchByAddress} className="flex gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter zip code or address (e.g. 90210 or 123 Main St, Los Angeles, CA)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Area
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Search by zip code or address, then pan/zoom the map to browse. Results auto-update at zoom level 8+.
        </p>
      </Card>

      <div className="relative rounded-lg overflow-hidden border">
        {!mapToken && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <div ref={mapContainer} className="w-full h-[500px] md:h-[600px]" />
      </div>
    </div>
  );
}
