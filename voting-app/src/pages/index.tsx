import axios from "axios";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useZuAuth } from "zuauth";
import { Profile } from "./profile";
import { ethers } from "ethers";

export default function Home() {
  const { authenticate, pcd } = useZuAuth();
  const [user, setUser] = useState<any>();

  console.log("semaphore id", user?.attendeeSemaphoreId);

  // Every time the page loads, an API call is made to check if the
  // user is logged in and, if they are, to retrieve the current session's user data.
  useEffect(() => {
    (async function () {
      const { data } = await axios.get("/api/user");
      setUser(data.user);
    })();
  }, []);

  // Before logging in, the PCD is generated with the nonce from the
  // session created on the server.
  // Note that the nonce is used as a watermark for the PCD. Therefore,
  // it will be necessary on the server side to verify that the PCD's
  // watermark matches the session nonce.
  const login = useCallback(async () => {
    const { data } = await axios.post("/api/nonce");
    authenticate(
      {
        revealEventId: true,
        revealAttendeeSemaphoreId: true,
      },
      data.nonce,
    );
  }, [authenticate]);

  // When the popup is closed and the user successfully
  // generates the PCD, they can login.
  useEffect(() => {
    (async function () {
      if (pcd) {
        const { data } = await axios.post("/api/login", { pcd });
        setUser(data.user);
      }
    })();
  }, [pcd]);

  // Logging out simply clears the active session.
  const logout = useCallback(async () => {
    await axios.post("/api/logout");
    setUser(false);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 pb-32">
      <Head>
        <title>ZuAuth Example</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-xl w-full">
        <div className="my-8 text-center">
          <button
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
            onClick={!user ? login : logout}
          >
            {!user ? "Login" : "Log out"}
          </button>
        </div>

        {user && (
          <>
            {/* <div className="text-center">Semaphore Id: {user.attendeeSemaphoreId}</div> */}

            <Profile semaphoreId={user?.attendeeSemaphoreId} />
          </>
        )}
      </div>
    </main>
  );
}
