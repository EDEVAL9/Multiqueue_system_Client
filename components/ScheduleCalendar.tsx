'use client';
import { redirectToMicrosoftLogin } from '@/actions/natigation';
import { axiosAPI, formatScheduleDate } from '@/lib/utils';
import { TutorI } from '@/types/tutor.types';
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  ActionEventArgs,
} from '@syncfusion/ej2-react-schedule';
import { Session } from 'next-auth';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { DateTime } from 'luxon';

interface CalendarItem {
  Id: number;
  Subject: string;
  Location: string;
  StartTime: string;
  EndTime: string;
  Description?: string;
}

interface SyncfusionCalendarItem {
  Id: number;
  Subject: string;
  Location: string;
  StartTime: Date;
  EndTime: Date;
  Description?: string;
  showAs: string;
}

type DaysOfTheWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

interface MSScheduleI {
  scheduleId: string;
  availabilityView: string;
  scheduleItems: [
    {
      isPrivate: boolean;
      status: string;
      subject: string;
      location: string;
      isMeeting: boolean;
      isRecurring: boolean;
      isException: boolean;
      isReminderSet: boolean;
      start: {
        dateTime: Date;
        timeZone: string;
      };
      end: {
        dateTime: Date;
        timeZone: string;
      };
    }
  ];
  workingHours: {
    daysOfWeek: DaysOfTheWeek[];
    startTime: string;
    endTime: string;
    timeZone: {
      name: string;
    };
  };
}

const ScheduleCalendar = ({ session }: { session: Session | null }) => {
  const params = useParams();
  const id = params?.id;
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [availabilities, setAvailabilities] = useState<
    SyncfusionCalendarItem[]
  >([]);
  const [user, setUser] = useState<TutorI | null>(null);

  const init = async () => {
    let user;
    if (!session?.user?.email) return;
    try {
      if (!pageLoaded && id) {
        const userResponse = await axiosAPI.get(
          `/users/email/${session?.user?.email}`
        );
        user = userResponse?.data;
        const scheduleResponse = await axiosAPI.get<{ data: MSScheduleI }>(
          `/tutor/${id}/get-availability`
        );

        setUser(user);

        const scheduleItems = scheduleResponse?.data;
        let formattedSchedules: SyncfusionCalendarItem[] = [];
        if (Array.isArray(scheduleItems.data)) {
          console.log('IS ARRAY');
          formattedSchedules = scheduleItems.data
            // .filter((item) => item.showAs === 'free')
            .map((item: any, index) => {
              console.log(item);
              return {
                Id: index + 1,
                Subject: item.subject,
                Location: item.location,
                StartTime: DateTime.fromISO(item?.start?.dateTime, {
                  zone: item?.start?.zone,
                })
                  .plus({ hour: 1 })
                  .toJSDate(),
                EndTime: DateTime.fromISO(item?.end?.dateTime, {
                  zone: item?.start?.zone,
                })
                  .plus({ hour: 1 })
                  .toJSDate(),
                showAs: item?.showAs,
              };
            });
        } else {
          console.log(typeof scheduleItems.data);
        }
        setAvailabilities(formattedSchedules);
      }
    } catch (error) {
      if (user?.accountType === 'TUTOR') {
        return redirectToMicrosoftLogin('/authorization/begin');
      }
    } finally {
      setPageLoaded(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

  // const data = [
  //   {
  //     Id: 1,
  //     Subject: "Scrum Meeting",
  //     Location: "Office",
  //     StartTime: new Date(2024, 2, 27, 9, 30),
  //     EndTime: new Date(2024, 3, 31, 10, 30),
  //     // RecurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1",
  //   },
  // ];

  const handleCreate = (data: any) => {
    console.log(data);
  };

  const handleActionBegin = async (event: ActionEventArgs) => {
    if (event?.requestType === 'eventChange') {
      toast.error('You cannot update this event', {
        position: 'bottom-right',
      });
      event.cancel = true;
      return event;
    }

    if (event?.requestType === 'eventRemove') {
      toast.error('You cannot delete this event', {
        position: 'bottom-right',
      });
      event.cancel = true;
      return event;
    }

    if (event?.requestType === 'eventCreate') {
      if (Array.isArray(event?.data) && event?.data?.length) {
        const data = event?.data[0];

        if (data.IsAllDay) {
          toast.error(
            'You cannot schedule an event for all day. Please select an available time',
            {
              position: 'bottom-right',
            }
          );
          event.cancel = true;
          return event;
        }

        // if (user?.accountType !== 'STUDENT') {
        //   event.cancel = true;
        //   return toast.error(
        //     'Only a logged in student can create an appointment',
        //     { position: 'bottom-right' }
        //   );
        // }

        const findAvailableTime = availabilities.find((item) => {
          const match =
            data?.StartTime.getTime() >= item?.StartTime.getTime() &&
            data?.StartTime.getTime() <= item?.EndTime.getTime() &&
            item?.showAs === 'free';

          return match;
        });

        const findTentativeEvents = availabilities.find((item) => {
          console.log(item?.showAs);
          const match =
            data?.StartTime.getTime() >= item?.StartTime.getTime() &&
            data?.StartTime.getTime() <= item?.EndTime.getTime() &&
            item?.showAs === 'tentative';

          return match;
        });

        console.log(`TEMTATIVE SSS`, findTentativeEvents);

        if (findTentativeEvents) {
          data.status = 'TENTATIVE';
        } else {
          data.status = 'BOOKED';
        }

        if (!findAvailableTime) {
          event.cancel = true;
          toast.error(
            "The time selected does not fall in the tutor's available time",
            {
              position: 'bottom-right',
            }
          );
          return event;
        }

        await handleAddEvent(data);
      }
    }

    return event;
  };

  const handleAddEvent = async (event: CalendarItem) => {
    try {
      await axiosAPI.post('/student/create-appointment', {
        tutorId: id,
        studentId: user?.id,
        event,
      });
      toast.success('Appointment added successfully', {
        position: 'bottom-right',
      });
    } catch (error) {
      toast.success('Could not create appointment. Try again', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <div style={{ paddingTop: ' 3rem' }}>
      {!pageLoaded && (
        <div>
          {' '}
          Loading schedules. please wait
          <ClipLoader
            color={'#237849'}
            loading={pageLoaded}
            // cssOverride={override}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <ScheduleComponent
        height="650px"
        selectedDate={new Date()}
        eventSettings={{
          dataSource: availabilities.filter((item) => item.showAs === 'free'),
        }}
        // eventRendered={onEventRendered}
        // currentView={currentView}
        created={handleCreate}
        actionBegin={handleActionBegin}
        timeScale={{ interval: 30, slotCount: 1 }}
        // timezone="WAT"
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </div>
  );
};

export default ScheduleCalendar;
