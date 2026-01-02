import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    // Changed background to flat gray to match Login
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Brand Logo Header */}
      <div className="mb-8 text-center">
         <Link href="/" className="flex items-center justify-center gap-2 group">
            {/* Jumia-style Star Icon */}
            <div className="bg-[#F68B1E] text-white p-1 rounded shadow-sm group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-[#282828] tracking-tight">
              Fashion<span className="text-[#F68B1E]">Store</span>
            </span>
         </Link>
      </div>

      <div className="max-w-md w-full">
        {/* Card: Added Orange Top Border and removed rounded-2xl for sharper rounded-lg */}
        <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-[#F68B1E]">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#282828]">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join us and start shopping today
            </p>
          </div>

          {/* Register Form */}
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}