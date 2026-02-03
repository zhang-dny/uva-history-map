'use client'

import { Sidebar } from "./sidebar"
import { MapContainer } from "./map-container"
import { getBuildings } from "@/actions/buildings"
import { useState, useEffect } from "react"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { WelcomeBanner } from "@/app/(admin)/admin/WelcomeBanner"

export function AppShell() {
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
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <WelcomeBanner />
      <Sidebar />
      <MapContainer buildings={buildings} adminMode={true} />
    </div>
  )
}