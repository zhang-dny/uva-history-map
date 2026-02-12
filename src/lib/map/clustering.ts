import Supercluster from "supercluster"
import type {Feature, Point } from 'geojson'
import type { BuildingWithCoordinates} from "@/actions/buildings"
import type { MapMarker } from "@/components/map/types"
import { MAP_CONFIG } from "../constants/map"

type BuildingPointProps = { 
    type: 'building'
    building: BuildingWithCoordinates
}

type ClusterPointProps = {
    cluster: true
    cluster_id: number
    point_count: number
    point_count_abbreviated: number | string
}

export type ClusterMapItem = 
 | {
    kind: 'cluster'
    id: string
    clusterId: number
    pointCount: number
    longitude: number
    latitude: number
    }
 | {
    kind: 'building'
    id: number
    building: BuildingWithCoordinates
    longitude: number
    latitude: number
    }

function toGeoJsonPoints(
    markers: MapMarker[]
    ): Array<Feature<Point, BuildingPointProps>> {
    return markers.map((marker) => ({
        type: 'Feature',
        geometry: {
        type: 'Point',
        coordinates: [marker.longitude, marker.latitude],
        },
        properties: {
        type: 'building',
        building: marker.building,
        },
    }))
    }
    export function getClusteredMapItems(params: {
        markers: MapMarker[]
        bounds: [number, number, number, number] // [west, south, east, north]
        zoom: number
      }): ClusterMapItem[] {
        const { markers, bounds, zoom } = params
        const points = toGeoJsonPoints(markers)
      
        const index = new Supercluster<BuildingPointProps, ClusterPointProps>({
          radius: MAP_CONFIG.CLUSTER_RADIUS,
          maxZoom: MAP_CONFIG.CLUSTER_MAX_ZOOM,
        })
      
        index.load(points)
      
        const features = index.getClusters(bounds, Math.floor(zoom))
      
        return features.map((feature): ClusterMapItem => {
          const [longitude, latitude] = feature.geometry.coordinates
          const props = feature.properties
      
          if ('cluster' in props && props.cluster) {
            return {
              kind: 'cluster',
              id: `cluster-${props.cluster_id}`,
              clusterId: props.cluster_id,
              pointCount: props.point_count,
              longitude,
              latitude,
            }
          }
          const buildingProps = props as  BuildingPointProps
          return {
            kind: 'building',
            id: buildingProps.building.id,
            building: buildingProps.building,
            longitude,
            latitude,
          }
        })
    }    