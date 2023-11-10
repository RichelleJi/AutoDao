'use client';

import Image from 'next/image';
import { useRef, useState, useEffect, SetStateAction} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {useChat} from 'ai/react';
import Footer from '../components/Footer';
import Github from '../components/GitHub';
import Header from '../components/Header';
import RadioGroupStars from '../components/RadioGroupStars';


export default function Page() {
  const strategyRef = useRef<null | HTMLDivElement>(null);
  const [userRating, setUserRating] = useState(0);
  const [userHandHistory, setUserHandHistory] = useState("");
  const scrollToStrategies = () => {
    if (strategyRef.current !== null) {
      strategyRef.current.scrollIntoView({behavior: 'smooth'});
    }
  };
  const [userFeedbackId, setUserFeedbackId] = useState(null);
  const [userFeedback, setUserFeedback] = useState("");

  const {input, handleInputChange, handleSubmit, isLoading, messages} =
    useChat({
      onResponse() {
        scrollToStrategies();
      },
      onError(error) {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 5013,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      },
    });

  const onSubmit = (e: any) => {
    e.preventDefault();
    setUserHandHistory(input);
    handleSubmit(e);
  };

  const handleUserFeedbackChange = (e: any) => {
    setUserFeedback(e.target.value);
  }
  const onUserFeedbackSubmit = async (e: any) => {
    e.preventDefault();
    const reqData = {id: userFeedbackId, feedback: userFeedback, rating: userRating}

    await fetch('/api/user-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({reqData}),
    })
    toast.success('Thanks for your feedback!', {
      position: "top-center",
      autoClose: 5013,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setUserFeedback("")
    setUserFeedbackId(null)
  };

  const lastMessage = messages[messages.length - 1];
  const generatedStrategy = lastMessage?.role === "assistant" ? lastMessage.content : null;

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header/>
      <ToastContainer
        position="top-center"
        autoClose={5013}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/RichelleJi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github/>
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Autonomous governance system for DAO
        </h1>
        <form className="max-w-xl w-full" onSubmit={onSubmit}>
          <p className="text-slate-500 mt-5">DAO's brain to approve proposals</p>
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Enter your proposal below:
            </p>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            rows={2}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              'e.g. Proposal to Approve Deployment on Scroll'
            }
          />
          {!isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="submit"
            >
              Get DAO's decision &rarr;
            </button>
          )}
          {isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <span className="loading">
                <span style={{backgroundColor: 'white'}}/>
                <span style={{backgroundColor: 'white'}}/>
                <span style={{backgroundColor: 'white'}}/>
              </span>
            </button>
          )}
        </form>
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700"/>
        <output className="space-y-10 my-10">
          {generatedStrategy && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={strategyRef}
                >
                  DAO's decision
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                  onClick={() => {
                    navigator.clipboard.writeText(userHandHistory);
                    toast('History copied to clipboard', {
                      icon: '✂️',
                    });
                  }}
                  key={userHandHistory}
                >
                <span className="text-slate-500">Your proposal:</span>
                  <p>{userHandHistory}</p>
                </div>
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedStrategy);
                    toast('Strategy copied to clipboard', {
                      icon: '✂️',
                    });
                  }}
                  key={generatedStrategy}
                >
                  <span className="text-slate-500">Dao's decision:</span>
                  <p>{generatedStrategy}</p>
                </div>
              </div>
            </>
          )}
        </output>
        {userFeedbackId && (
          <><RadioGroupStars items={[1, 2, 3, 4, 5]} onClickStar={(value: SetStateAction<number>) => setUserRating(value)} />
            <form className="max-w-xl w-full" onSubmit={onUserFeedbackSubmit}>
              <p className="text-center font-medium">
                Any feedback:
              </p>
              <textarea
                value={userFeedback}
                onChange={handleUserFeedbackChange}
                rows={2}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                placeholder={'e.g. feedback, comments or any additional poke-related questions you would like ask' +
                  ' the AI coach'}/>
              <button className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="submit">
                send &rarr;
              </button>
            </form>
          </>
        )}

      </main>
      <Footer />
    </div>
  );
}
