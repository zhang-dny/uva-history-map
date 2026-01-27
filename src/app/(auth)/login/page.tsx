import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Enter your email and password to login
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="you@virginia.edu"
                    required
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    />
                </div>

                <Button type="submit" className="w-full">
                    Sign In
                </Button>
                </form>
            </CardContent>
        </Card>
    )
}