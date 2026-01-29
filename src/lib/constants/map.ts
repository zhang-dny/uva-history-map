export const MAP_CONFIG = {
    UVA_CENTER: {
        longitude: -78.5079,
        latitude: 38.0336,
    },

    DEFAULT_ZOOM: 15,
    MIN_ZOOM: 10,
    MAX_ZOOM: 18,

    CLUSTER_RADIUS: 50,
    CLUSTER_MAX_ZOOM: 15,
} as const

export const getMapStyle = () => 
  `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`

