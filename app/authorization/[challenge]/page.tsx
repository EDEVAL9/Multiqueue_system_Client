"use client";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";

const scopes = [
  "openid",
  "profile",
  "offline_access",
  "user.read",
  "calendars.read",
  "Calendars.ReadWrite",
];

const BeginAuthorization = () => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const appSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const tenantId = "common";
  const redirectUri = String(process.env.NEXT_PUBLIC_MS_REDIRECT_URL);
  const authURL = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}`;

  const handleClick = () => {
    return redirect(authURL);
  };
  return (
    <Container>
      <div>
        <Link href={authURL} passHref>
          <Button onClick={handleClick}>
            Authorize with Microsoft
            <StyledImage alt="Microsoft logo" src={"/ms-logo.webp"} />
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default BeginAuthorization;

const StyledImage = styled.img`
  margin-left: 10px;
  width: 50px;
  height: 50px;
`;

const Container = styled.div`
  min-height: 60vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    border: 1px solid rgba(10, 10, 10, 0.4);
  }
`;
