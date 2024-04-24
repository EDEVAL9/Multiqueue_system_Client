import { auth } from 'auth';
import dynamic from 'next/dynamic';
import { axiosAPI } from '@/lib/utils';
import { TutorI } from '@/types/tutor.types';
import { redirect } from 'next/navigation';
import { redirectToMicrosoftLogin } from '@/actions/natigation';

const HomeComponent = dynamic(() => import('../components/home'), {
  // Specify loading options if needed
  loading: () => <div>Loading...</div>,
  ssr: false,
});

export default async function Index() {
  const session = await auth();

  let user = null;
  try {
    user = (await axiosAPI.get<TutorI>('/users/email/' + session?.user?.email))
      .data;
  } catch (e) {
    console.log(e);
    console.log('Not authenticated, user not found');
    return redirect('/auth/signin');
  }

  if (user?.accountType === 'TUTOR' && !user?.msGraphAccessToken) {
    //TOKEN REDIRECT
    return redirectToMicrosoftLogin('/authorization/begin');
  }

  if (user?.accountType === 'TUTOR') {
    return redirectToMicrosoftLogin(`/schedule/${user?.id}`);
  }

  return <HomeComponent session={session} />;
}
