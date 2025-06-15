
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = () => {
  const form = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log('Register form submitted:', data);
    // Handle registration logic here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email è richiesta',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Inserisci un email valida'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="nome@azienda.com"
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
          rules={{
            required: 'Password è richiesta',
            minLength: {
              value: 6,
              message: 'La password deve essere di almeno 6 caratteri'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          rules={{
            required: 'Conferma password è richiesta',
            validate: (value) => {
              const password = form.getValues('password');
              return value === password || 'Le password non corrispondono';
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conferma Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Registrati
        </Button>
      </form>
    </Form>
  );
};
