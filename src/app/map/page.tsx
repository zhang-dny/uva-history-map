'use client'
import { MapContainer } from "@/components/layout/map-container"
import {useState, useEffect} from 'react'
import { getBuildings } from "@/actions/buildings"
import type { BuildingWithCoordinates } from "@/actions/buildings"

export default function PublicMapPage() {
  const [buildings, setBuildings] = useState<BuildingWithCoordinates[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getBuildings()
      .then(data => {
        setBuildings(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching buildings:', error)
        setLoading(false)
      })
  }, [])
  if (loading) {
    return <div className="flex h-screen item-center justify-center"> Loading Map...</div>
  }
  return (
    <div className="flex h-screen w-full">
      <MapContainer 
      buildings = {buildings}
      showLoginButton = {true} />
    </div>
  )
}