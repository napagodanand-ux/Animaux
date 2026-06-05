'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { PawPrint, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type AuthForm = z.infer<typeof authSchema>

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
  })

  const handleRedirect = (email: string) => {
    if (email === ADMIN_EMAIL) {
      router.push('/admin')
    } else {
      router.push('/survey/welcome')
    }
  }

  const onSubmit = async (data: AuthForm) => {
    setLoading(true)
    try {
      if (tab === 'signup') {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) throw error
        if (signUpData.user?.identities?.length === 0) {
          toast.error('An account with this email already exists. Please sign in.')
        } else {
          toast.success('Account created! Redirecting...')
          handleRedirect(data.email)
        }
      } else {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (error) throw error
        toast.success('Welcome back!')
        handleRedirect(signInData.user.email!)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed'
      toast.error(message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-page flex items-center justify-center p-4 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl bg-pink-300 dark:bg-purple-600" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl bg-purple-300 dark:bg-pink-600" />
      </div>

      {/* Theme switcher */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600
              dark:from-purple-500 dark:to-pink-400 flex items-center justify-center 
              shadow-lg mx-auto mb-4"
          >
            <PawPrint className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-2xl font-black">Animaux</h1>
          <p className="text-muted-foreground text-sm mt-1">Pet-Owner Research Platform</p>
        </div>

        <div className="card-premium p-8">
          {/* Tabs */}
          <div className="flex rounded-xl bg-muted p-1 mb-8">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); reset() }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? 'bg-white dark:bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                id={`auth-tab-${t}`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === 'signup' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === 'signup' ? -20 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" htmlFor="auth-email">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      {...register('email')}
                      id="auth-email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background
                        text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" htmlFor="auth-password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      {...register('password')}
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={tab === 'signup' ? 'Min. 6 characters' : '••••••••'}
                      autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background
                        text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-pink-500 to-purple-600
                    dark:from-purple-500 dark:to-pink-500
                    hover:shadow-lg hover:shadow-pink-500/30
                    dark:hover:shadow-purple-500/30
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-shadow duration-200 flex items-center justify-center gap-2"
                  id={`auth-submit-${tab}`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or continue with</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Google */}
              <motion.button
                onClick={handleGoogle}
                disabled={googleLoading}
                whileHover={{ scale: googleLoading ? 1 : 1.02 }}
                whileTap={{ scale: googleLoading ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl font-medium text-sm border border-border
                  bg-background hover:bg-muted transition-colors flex items-center justify-center gap-3
                  disabled:opacity-60 disabled:cursor-not-allowed"
                id="auth-google"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Your data is encrypted and never shared with third parties.
        </p>
      </motion.div>
    </div>
  )
}
