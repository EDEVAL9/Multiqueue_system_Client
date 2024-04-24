"use server";

import { redirect } from "next/navigation";

export async function redirectToTutorSchedule(id: number) {
  redirect(`/schedule/${id}`);
}

export async function redirectToMicrosoftLogin(url: string) {
  redirect(url);
}
