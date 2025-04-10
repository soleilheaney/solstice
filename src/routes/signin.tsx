import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import type { ComponentProps } from "react";
import { useForm } from "@tanstack/react-form";
import authClient from "~/lib/auth-client";
import { Button } from "~/lib/components/ui/button";
import { cn } from "~/lib/utils";
import { Input } from "~/lib/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/lib/components/ui/card";

const REDIRECT_URL = "/dashboard";

export const Route = createFileRoute("/signin")({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
  },
});

function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <SignInButton
              provider="discord"
              label="Discord"
              className="bg-[#5865F2] hover:bg-[#5865F2]/80"
            />
            <SignInButton
              provider="github"
              label="GitHub"
              className="bg-neutral-700 hover:bg-neutral-700/80"
            />
            <SignInButton
              provider="google"
              label="Google"
              className="bg-[#DB4437] hover:bg-[#DB4437]/80"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { error } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
          callbackURL: REDIRECT_URL,
        });
        
        if (error) {
          setError(error.message || "Failed to sign in");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => 
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Please enter a valid email address",
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label htmlFor={field.name} className="text-sm font-medium">
              Email
            </label>
            <Input
              id={field.name}
              name={field.name}
              type="email"
              placeholder="you@example.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors ? "border-red-500" : ""}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => 
            value.length >= 8 ? undefined : "Password must be at least 8 characters",
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label htmlFor={field.name} className="text-sm font-medium">
              Password
            </label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              placeholder="••••••••"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors ? "border-red-500" : ""}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!canSubmit || isLoading || isSubmitting}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { error } = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          callbackURL: REDIRECT_URL,
        });
        
        if (error) {
          setError(error.message || "Failed to create account");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => 
            value.length >= 2 ? undefined : "Name must be at least 2 characters",
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label htmlFor={field.name} className="text-sm font-medium">
              Name
            </label>
            <Input
              id={field.name}
              name={field.name}
              placeholder="John Doe"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors ? "border-red-500" : ""}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => 
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Please enter a valid email address",
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label htmlFor={field.name} className="text-sm font-medium">
              Email
            </label>
            <Input
              id={field.name}
              name={field.name}
              type="email"
              placeholder="you@example.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors ? "border-red-500" : ""}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => 
            value.length >= 8 ? undefined : "Password must be at least 8 characters",
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label htmlFor={field.name} className="text-sm font-medium">
              Password
            </label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              placeholder="••••••••"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors ? "border-red-500" : ""}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!canSubmit || isLoading || isSubmitting}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

interface SignInButtonProps extends ComponentProps<typeof Button> {
  provider: "discord" | "google" | "github";
  label: string;
}

function SignInButton({ provider, label, className, ...props }: SignInButtonProps) {
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }
      type="button"
      size="lg"
      className={cn("text-white hover:text-white", className)}
      {...props}
    >
      Sign in with {label}
    </Button>
  );
}
