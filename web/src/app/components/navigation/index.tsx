"use client";
import React from "react";
import Link from "next/link";
import { GithubOutlined } from "@ant-design/icons";
import { GITHUB_URL } from "@/app/util/constants";

const Navbar = () => {
  const onGithubClick = () => {
    window.open(GITHUB_URL);
  };
  return (
    <div className="w-full h-10 bg-black sticky top-0">
      <div className="flex">
        <div className="w-5/6 content-center ms-5">
          {/* <Logo /> */}
          <ul className="hidden md:flex gap-x-6 text-white">
            <li>
              <Link href="/about">
                <p>Contact</p>
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-1/6 h-10 content-center me-5">
          <div className="flex justify-end">
            <GithubOutlined
              onClick={onGithubClick}
              className="text-white justify-center	"
              href="https://www.github.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
