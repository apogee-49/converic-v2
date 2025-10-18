import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className="flex items-center justify-center h-screen">
    <SignIn signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}/>
  </div>
  );
}