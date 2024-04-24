import axios, { Axios } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const axiosAPI: Axios = axios.create({
  // baseURL: "http://localhost:8000",
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

export const formatScheduleDate = (inputDateString: string) => {
  {
    // const inputDateString = '2024-04-09T11:00:00.0000000';

    // Split the input date string into date and time parts
    const [datePart, timePart] = inputDateString.split('T');

    // Split the date part into year, month, and day
    const [year, month, day] = datePart.split('-');

    // Format the date
    const formattedDate = `${year}/${month}/${day}`;

    // Extract the hour and minute from the time part
    // const [hour, minute] = timePart.split(':')[(0, 1)];

    const hour = timePart[0];
    const minute = timePart[1];

    // Format the time
    const formattedTime = `${hour}:${minute}`;

    // Combine the formatted date and time
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    console.log(formattedDateTime); // Output: "2024/04/09 11:00"
    return formattedDateTime;
  }
};
