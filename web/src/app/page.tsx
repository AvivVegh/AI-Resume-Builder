"use client";

export default function Home() {
  const onSigninClick = () => {
    location.href = "http://localhost:3002/auth/linkedin";
  };

  return (
    <div className="flex justify-center justify-items-center justify-self-center">
      <div className="flex flex-col ">
        <h1 className="text-align: center font-title mt-20 text-2xl font-medium	justify-self-center	">
          Welcome to AI Resume Builder
        </h1>
        <div className="flex flex-row justify-center align-middle	items-center mt-5">
          <div
            className="flex flex-wrap border-2 p-1 bg-white  hover:bg-sky-700 "
            onClick={onSigninClick}
          >
            <p className="font-medium text-l mr-0.5 ">Sign in with</p>
            <img className="size-6 " src="/images/linkedin.png" />
          </div>
        </div>
      </div>
    </div>
  );
}
