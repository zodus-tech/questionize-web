'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { RegisterData } from '@/interfaces/auth-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

const registerSchema = z.object({
  fullName: z.string().max(50).nonempty('O nome completo é obrigatório.'),
  username: z.string().max(50).nonempty('O usuário é obrigatório.'),
  email: z
    .string()
    .email({ message: 'O e-mail não é válido.' })
    .nonempty('O e-mail é obrigatório.'),
  password: z
    .string()
    .min(6, { message: 'A senha deve conter no mínimo 6 caracteres.' })
    .nonempty('A senha é obrigatória.'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  })

  const { register } = useAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [passwordHidden, setPasswordHidden] = useState(false)

  const hideShowPassword = () => {
    setPasswordHidden(!passwordHidden)
  }

  const router = useRouter()

  const onSubmit = async (data: RegisterData) => {
    setLoading(true)
    setError('')
    setSuccessMessage('')
    try {
      const result = await register(data)
      console.log(result.success)
      if (result.success) {
        console.log('pass, but reset.')

        toast({
          title: 'Cadastro',
          description: 'Cadastro realizado com succeso.',
        })

        const callbackUrl = Cookies.get('callbackUrl') || '/admin/dashboard'

        Cookies.remove('callbackUrl')

        router.push(callbackUrl)
      } else {
        setError(result.error || 'Erro ao realizar o cadastro.')

        toast({
          title: 'Erro',
          description: result.error || 'Erro ao realizar o cadastro.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      setError('Erro ao realizar o cadastro.')
      toast({
        title: 'Erro',
        description: 'Erro ao realizar o cadastro.',
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
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(/placeholder_banner.png)',
      }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-left">
            Cadastro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu nome completo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite seu e-mail"
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

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert
                  variant="default"
                  className="bg-green-100 text-green-800 border-green-300"
                >
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Carregando...' : 'Confirmar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
