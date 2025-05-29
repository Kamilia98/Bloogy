import { Outlet } from 'react-router-dom';
import Logo from '../components/ui/Logo';

export default function AuthLayout() {
  return (
    <div>
      <main className="flex h-screen w-full overflow-hidden">
        {/* Left Image */}
        <aside className="relative hidden w-3/5 md:block">
          <img
            src="/images/login.png"
            alt="Bloogy login background"
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </aside>

        {/* Right Login Form */}
        <section className="flex-1 overflow-auto bg-white p-8 shadow-lg md:p-12">
          <div className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-6">
            {/* Logo */}
            <Logo />
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
