'use client';

import { axiosAPI } from '@/lib/utils';
import styled from '@emotion/styled';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const AUTHORIZING = 'AUTHORIZING';
const AUTHORIZED = 'AUTHORIZED';
const FAILED = 'FAILED';

const AuthorizedCallback = ({ session }: { session: any }) => {
  // const session = useSession();
  const [status, setStatus] = useState<'AUTHORIZING' | 'AUTHORIZED' | 'FAILED'>(
    AUTHORIZING
  );
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  console.log(code);

  const authorize = useCallback(async () => {
    {
      try {
        const res = await axiosAPI.post('/ms-graph/authorize', {
          code,
          email: session?.user?.email,
        });

        setStatus(AUTHORIZED);
      } catch (error) {
        setStatus(FAILED);
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    if (status === AUTHORIZING && code !== '') {
      authorize();
    }
  }, []);

  return (
    <Wrapper>
      {status === 'AUTHORIZING' ? (
        <h1>AUTHORIZING...</h1>
      ) : status === 'AUTHORIZED' ? (
        <div className="success">
          <img src="/check.jpg" alt="Success" />
          <h1>AUTHORIZATION SUCCESSFUL</h1>
        </div>
      ) : (
        <div className="fail">
          <img src="/fail.jpg" alt="Success" />
          <h1>FAILED TO AUTHORIZE</h1>
        </div>
      )}
    </Wrapper>
  );
};

export default AuthorizedCallback;

const Wrapper = styled.div`
  width: 100%;
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100px;
    // height: 100px;
    margin-bottom: 2rem;
  }
  .fail {
  }
  div {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
`;
