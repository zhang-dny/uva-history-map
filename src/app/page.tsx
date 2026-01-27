import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">UVA History Map</CardTitle>
          <CardDescription>
            Explore the historical buildings and landmarks of the University of Virginia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">View Map</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Admin Login</Link>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Phase 1: Authentication & Layouts ✅</p>
            <p>Phase 2: Interactive Map (Coming Soon)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
