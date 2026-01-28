'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    
    if (error) {
        return { error: error.message }
    } 

    redirect('/dashboard')
}

/**
 * Server Action: Sign up with email and password
 * 
 * Creates a new user account in Supabase Auth
 */
export async function signUp(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })
    
    if (error) {
        return { error: error.message }
    } 

    // Success! Redirect to dashboard
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}