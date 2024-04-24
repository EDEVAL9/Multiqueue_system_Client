'use client';
import { axiosAPI } from '@/lib/utils';
import styled from '@emotion/styled';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';

const StudentScheduleComponent = ({ session }: { session: Session | null }) => {
  const [schedules, setSchedules] = useState<any[]>([]);
  console.log(schedules);
  const SchedulesRender = () => {
    if (Array.isArray(schedules) && schedules.length) {
      return schedules.map((schedule, index) => {
        return (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{schedule?.subject}</TableCell>
            <TableCell>Valentine Okaro</TableCell>
            <TableCell>{schedule?.startTime}</TableCell>
            <TableCell>{schedule?.status}</TableCell>
          </TableRow>
        );
      });
    }
    return <h1>Student has no schedules on this app.</h1>;
  };

  const init = async () => {
    if (session?.user?.email) {
      try {
        const res = await axiosAPI.get(
          `/student/schedules/${session?.user?.email}`
        );
        setSchedules(res.data);
      } catch (error) {
        console.log(error, 'Could not fetch schedules');
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SN</TableCell>
            <TableCell>Schedule subject</TableCell>
            <TableCell>Tutor</TableCell>
            <TableCell>Start time</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((schedule, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{schedule?.subject}</TableCell>
                <TableCell>
                  {`${schedule?.tutor?.lastName}`} {schedule?.tutor?.firstName}
                </TableCell>
                <TableCell>{schedule?.startTime}</TableCell>
                <TableCell>
                  {String(schedule?.status).toUpperCase() === 'BOOKED' ? (
                    <ActiveStatus>{schedule?.status}</ActiveStatus>
                  ) : String(schedule?.status).toUpperCase() === 'TENTATIVE' ? (
                    <TentativeStatus>{schedule?.status}</TentativeStatus>
                  ) : (
                    <CanelledStatus>{schedule?.status}</CanelledStatus>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentScheduleComponent;

const ActiveStatus = styled.span`
  color: #459045;
  border: 1px solid #459045;
  background-color: #c9f3c9;
  padding: 4px 14px;
  font-size: 8pt;
  border-radius: 20px;
`;

const CanelledStatus = styled.span`
  color: #d91010;
  border: 1px solid #d91010;
  background-color: #f6d6d6;
  padding: 4px 8px;
  font-size: 8pt;
  border-radius: 20px;
`;

const TentativeStatus = styled.span`
  color: #36006f;
  border: 1px solid #36006f;
  background-color: #d9c3f0;
  padding: 4px 8px;
  font-size: 8pt;
  border-radius: 20px;
`;
