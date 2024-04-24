"use client";
import { useState } from "react";
// import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { axiosAPI } from "@/lib/utils";
import Link from "next/link";
import styled from "@emotion/styled";
import { TutorI } from "@/types/tutor.types";
import { redirectToTutorSchedule } from "@/actions/natigation";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

const HomeComponent = ({ session }: any) => {
  const [search, setSearch] = useState<string>("");
  const [tutors, setTutors] = useState<TutorI[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // const router = useRouter();

  const handleSelectTutor = (tutor: TutorI) => {
    if (!tutor?.msGraphAccessToken)
      return toast.error("Tutor is not available for schedule", {
        position: "bottom-right",
      });
    redirectToTutorSchedule(tutor?.id);
  };

  const handleSearch = async () => {
    try {
      if (!search)
        return toast.error("You must enter text to search", {
          position: "bottom-right",
        });
      setIsSearching(true);
      const res = await axiosAPI.get<TutorI[]>(`/tutors/search?q=${search}`);

      setTutors(res.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSearching(false);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">
        Welcome back, {session?.user?.name}
      </h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Find an instructor to book a schedule</span>
        <Link href={"/student/schedule"}>
          <Button>View my schedules</Button>
        </Link>
      </div>
      <div
        className="flex flex-col rounded-md bg-neutral-100"
        style={panestyle}
      >
        <div className="searchContainer">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            value="Search"
            variant="contained"
            // variant="default"
            color="primary"
            disabled={isSearching}
          >
            {isSearching ? " wait..." : "Search"}
          </Button>
        </div>

        <InstructorContainer className="instructorList">
          <ul>
            {tutors.map((tutor, index) => {
              return (
                <li key={index} onClick={() => handleSelectTutor(tutor)}>
                  <Link href="/">
                    {tutor?.firstName} {tutor?.lastName}
                  </Link>
                  <p>{tutor.accountType}</p>
                  <span>{tutor?.email}</span>
                </li>
              );
            })}
          </ul>
        </InstructorContainer>
      </div>
    </div>
  );
};

const panestyle = {
  minHeight: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default HomeComponent;

const InstructorContainer = styled.div`
  background: white;
  width: calc(80% - 10px);
  position: relative;
  left: -55px;
  overflow-y: scroll;
  max-height: 300px;
  top: 10px;
  ul {
    li {
      cursor: pointer;
      padding: 1rem;
      border-bottom: 1px solid grey;
      &:hover {
        background: darken(white, 20);
      }
      p {
        font-size: 8pt;
        line-height: 0.5;
        margin-top: 0.3rem;
      }
      span {
        font-size: 8pt;
      }
    }
  }
`;
