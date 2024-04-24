import { auth } from '@/auth';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import { Button } from '@mui/material';
import Link from 'next/link';

const SchedulePage = async () => {
  const session = await auth();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Schedules page</h1>
        <Link href="/">
          <Button>Home</Button>
        </Link>
      </div>
      <ScheduleCalendar session={session} />
    </div>
  );
};

export default SchedulePage;
