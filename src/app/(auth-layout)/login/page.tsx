import LoginForm from "@/components/modules/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">

      {/* LEFT IMAGE SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/TtPTZ.jpg"
          alt="Login Banner"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-black/40" />

        {/* Text */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-4xl font-bold mb-4">
            TaskOrbit
          </h1>
          <p className="text-lg text-white/90 max-w-md">
            Manage workflows, track tasks, and improve productivity with a simple dashboard experience.
          </p>
        </div>
      </div>

      {/* RIGHT FORM SIDE */}
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-6">
        <LoginForm />
      </div>

    </div>
  );
}