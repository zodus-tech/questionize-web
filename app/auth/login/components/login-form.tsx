'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from '@/hooks/use-toast'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

const loginSchema = z.object({
  username: z.string().nonempty('O nome de usuário é obrigatório.'),
  password: z.string().nonempty('A senha é obrigatória.'),
  rememberUser: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberUser: false,
    },
  })

  const { login } = useAuth()
  const { toast } = useToast()

  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [passwordHidden, setPasswordHidden] = useState(false)

  const hideShowPassword = () => {
    setPasswordHidden(!passwordHidden)
  }

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError('')
    try {
      const result = await login(data)
      if (result.success) {
        toast({
          title: 'Login',
          description: 'Login realizado com succeso.',
        })

        const callbackUrl = Cookies.get('callbackUrl') || '/dashboard'

        Cookies.remove('callbackUrl')

        router.push(callbackUrl)
      } else {
        setError(result.error || 'Erro ao realizar o login.')

        toast({
          title: 'Erro',
          description: result.error || 'Erro ao realizar o login.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      setError('Erro ao realizar o login.')
      toast({
        title: 'Erro',
        description: 'Erro ao realizar o login.',
        variant: 'destructive',
      })

      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      /* style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(/placeholder_banner.png)',
      }} */
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-left">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Usuário</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu nome de usuário"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="w-full h-fit gap-1 grid grid-cols-[1fr,2.5rem]">
                        <Input
                          type={passwordHidden ? 'text' : 'password'}
                          placeholder="Digite sua senha"
                          {...field}
                        />
                        <button
                          id="password-eye"
                          className="h-[90%] w-10 aspect-square px-2 border border-zinc-800 rounded-md flex items-center justify-center shadow"
                          type="button"
                          onClick={hideShowPassword}
                        >
                          {(passwordHidden && (
                            <EyeOffIcon className="w-5 h-5" />
                          )) || <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberUser"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Lembrar Usuário</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Carregando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Registre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
