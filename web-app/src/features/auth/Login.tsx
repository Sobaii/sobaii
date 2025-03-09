// src/pages/Login.js

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "./useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ILoginSchema, loginSchema } from "../../schemas/loginSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Card } from "@/components/ui/Card";
import LandingAnimation from "../../components/LandingAnimation";
import { GoogleLogo, ColouredLongLogo } from "../../assets/logos";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";

function Login() {
  const { onLoginSubmit, handleSignupWithGoogle, error } = useAuth();

  const methods = useForm<ILoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: ILoginSchema) => {
    await onLoginSubmit(data);
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <Card className="m-auto max-w-[500px]">
        <img src={ColouredLongLogo} className="h-7 w-fit" alt="Logo" />
        <h1 className="text-3xl font-semibold">Login to your account</h1>
        <p className="text-gray-600 text-sm">
          Let's get started with your projects.
        </p>
        <Form {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
              </FormControl>
              <FormMessage>{errors.email?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
              </FormControl>
              <FormMessage>{errors.password?.message}</FormMessage>
            </FormItem>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Separator />
            <Button type="submit">Login</Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleSignupWithGoogle}
            >
              <img
                src={GoogleLogo}
                alt="Google Logo"
                className="w-4 h-4 mr-2"
              />
              Login with Google
            </Button>
          </form>
        </Form>
        <div className="flex justify-center items-center mt-4">
          <div className="bg-gray-50 border p-2 pl-8 pr-8 rounded-lg flex">
            <p className="text-gray-600">Don't have an account?</p>
            <Link to="/signup" className="text-green-600 ml-1 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </Card>
      <LandingAnimation />
    </main>
  );
}

export default Login;
