import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { registerLicense } from '@syncfusion/ej2-base';

import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ['latin'] });
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Scheduling App',
  description: 'This is an example site to demonstrate how to use Scheduling',
};

registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE!);

const RedirectMSAuth = dynamic(() => import('../components/redirect-ms-auth'), {
  ssr: false,
});

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth();
  if (!session?.user) {
    return redirect('/auth/signin');
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col justify-between w-full h-full min-h-screen">
          <Header />
          <ToastContainer />
          <main className="flex-auto w-full max-w-3xl px-4 py-4 mx-auto sm:px-6 md:py-6">
            {children}
          </main>
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  );
}
