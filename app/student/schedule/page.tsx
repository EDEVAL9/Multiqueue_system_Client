import { auth } from "@/auth";
import StudentScheduleComponent from "@/components/StudentScheduleComponent";
import { axiosAPI } from "@/lib/utils";
import { Button } from "@mui/material";
import Link from "next/link";

const StudentSchedule = async () => {
  const session = await auth();

  return (
    <div>
      <h1 style={{ display: "flex", justifyContent: "space-between" }}>
        Student schedules{" "}
        <Link href={"/"}>
          <Button>Create schedule</Button>
        </Link>
      </h1>
      <StudentScheduleComponent session={session} />
    </div>
  );
};

export default StudentSchedule;
