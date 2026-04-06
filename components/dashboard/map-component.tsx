"use client";

import Map, { Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import bbox from "@turf/bbox";
import { useMemo } from "react";

type Props = {
  data: {
    geojson: any;
  };
};

export default function MapComponent({ data }: Props) {
  const bounds = useMemo(() => {
    if (!data.geojson) return null;

    // hasil: [minLng, minLat, maxLng, maxLat]
    return bbox(data.geojson);
  }, [data.geojson]);

  return (
    <div className="h-125 w-full">
      <Map
        initialViewState={
          bounds
            ? {
                bounds: [
                  [bounds[0], bounds[1]],
                  [bounds[2], bounds[3]],
                ],
                fitBoundsOptions: { padding: 40 },
              }
            : {
                longitude: 117, // fallback Indo
                latitude: -2,
                zoom: 4,
              }
        }
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
      >
        {data.geojson && (
          <Source id="area" type="geojson" data={data.geojson}>
            <Layer
              id="area-fill"
              type="fill"
              paint={{
                "fill-color": "#3b82f6",
                "fill-opacity": 0.4,
              }}
            />
            <Layer
              id="area-line"
              type="line"
              paint={{
                "line-color": "#1e40af",
                "line-width": 2,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
