import { redirectIfAuthenticated } from "@/src/lib/auth";
import { AuthForm } from "@/src/components/auth/auth-form";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return <AuthForm mode="login" />;
}
