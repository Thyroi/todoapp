import { redirectIfAuthenticated } from "@/src/lib/auth";
import { AuthForm } from "@/src/components/auth/auth-form";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return <AuthForm mode="register" />;
}
