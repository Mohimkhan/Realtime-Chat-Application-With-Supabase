"use client";
import Link from "next/link";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { useState } from "react";
import { appName } from "@/constants";
import LogoutModal from "../modals/LogoutModal";
import { ThemeBtn } from "./ThemeBtn";
import { KeyboardIcon, Crown, Settings, User, LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const Header = () => {
  const [isUserActionVisible, setIsUserActionVisible] = useState(false);
  const { user } = useCurrentUser();

  return (
    <>
      <header className="navbar p-0 pt-10">
        <div className="dark:text-[#e6eef7] text-[#1e293b] sm:hidden block">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className={`btn btn-ghost btn-circle ${user ? "mr-5" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow dark:bg-base-100 bg-[#e6eef7] rounded-box w-52"
            >
              <li className="flex justify-start items-center flex-row -gap-3 group">
                <div className="text-xs dark:text-[#e6eef7] text-[#1e293b]">
                  <KeyboardIcon size={20} />
                </div>
                <Link
                  href="/learn-typing"
                  className="group-hover:text-primary-color"
                >
                  Keyboard
                </Link>
              </li>
              <li className="flex justify-start items-center flex-row -gap-3 group">
                <div className="text-xs dark:text-[#e6eef7] text-[#1e293b]">
                  <Crown size={20} />
                </div>
                <Link
                  href="/leaderboard"
                  className="group-hover:text-primary-color"
                >
                  LeaderBoard
                </Link>
              </li>
              <li className="flex justify-start items-center flex-row -gap-3 group">
                <div className="text-xs dark:text-[#e6eef7] text-[#1e293b]">
                  <Settings size={20} />
                </div>
                <Link
                  href="/settings"
                  className="group-hover:text-primary-color"
                >
                  Settings
                </Link>
              </li>
              <li className="flex justify-start items-center flex-row -gap-3 group">
                <div className="text-xs dark:text-[#e6eef7] text-[#1e293b]">
                  <User size={20} />
                </div>

                <Link
                  href="/account"
                  className="group-hover:text-primary-color"
                >
                  Profile
                </Link>
              </li>
              <li className="flex justify-start items-center flex-row -gap-3 group">
                <div className="text-xs dark:text-[#e6eef7] text-[#1e293b]">
                  <LogOut size={20} />
                </div>
                <LogoutModal
                  className="py-0 -mt-1 dark:!text-[#d7dfe8] !text-[#1e293b] font-normal bg-transparent hover:bg-transparent shadow-none border-none justify-start pl-3 dark:hover:!text-primary-color"
                  onConfirmation={() => {
                    const supabase = createBrowserSupabaseClient;
                    supabase.auth.signOut();
                    setIsUserActionVisible(false);
                  }}
                  onCancel={() => setIsUserActionVisible(false)}
                ></LogoutModal>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto sm:mx-0 flex gap-4">
          <Link
            className="btn btn-ghost text-xl text-primary-color gap-0 border-none p-0"
            href="/"
          >
            <div>
              <span className="first-letter:text-2xl">{appName}</span>
            </div>
          </Link>
          <div className="sm:flex hidden justify-center items-center gap-4">
            <div className="text-xl dark:text-[#e6eef7] text-[#1e293b] hover:scale-125">
              <Link href="/learn-typing">
                <KeyboardIcon />
              </Link>
            </div>
            <div className="text-xl dark:text-[#e6eef7] text-[#1e293b] hover:scale-125">
              <Link href="/leaderboard">
                <Crown />
              </Link>
            </div>
            <div className="text-xl dark:text-[#e6eef7] text-[#1e293b] hover:scale-125">
              <Link href="/settings">
                <Settings />
              </Link>
            </div>
          </div>
        </div>
        <div className="sm:ml-auto flex-none">
          <div
            className={`dropdown dropdown-end flex justify-center items-center gap-3 md:gap-4 w-full`}
          >
            <ThemeBtn />
            {user ? (
              <>
                <AnimatedTooltip
                  items={[
                    {
                      id: user?.id.charCodeAt(
                        Math.floor(Math.random() * user?.id.length),
                      ),
                      image:
                        user?.user_metadata?.avatar_url ||
                        "/avatar/skeleton_6.jpg",
                      name: user.user_metadata?.name.slice(
                        0,
                        user.user_metadata?.name.indexOf(" "),
                      ),
                      designation: user?.user_metadata?.designation ?? "",
                    },
                  ]}
                  setIsUserActionVisible={setIsUserActionVisible}
                />
                {isUserActionVisible && (
                  <ul
                    tabIndex={0}
                    className="menu menu-sm mt-3 z-[1] p-2 absolute shadow dark:bg-base-100 text-[#1e293b] dark:text-[#e6eef7] bg-[#e6eef7] rounded-box w-52 top-10 right-0 hidden sm:block"
                  >
                    <li className="dark:hover:text-primary-color hover:scale-105">
                      <Link
                        href="/account"
                        className="justify-between"
                      >
                        Profile
                        <span className="badge">New</span>
                      </Link>
                    </li>
                    <li className="hover:scale-105">
                      <LogoutModal
                        className="py-0 dark:!text-[#d7dfe8] !text-[#1e293b] font-normal bg-transparent hover:bg-transparent shadow-none border-none justify-start pl-3 dark:hover:!text-primary-color"
                        onConfirmation={() => {
                          const supabase = createBrowserSupabaseClient;
                          supabase.auth.signOut();
                          setIsUserActionVisible(false);
                        }}
                        onCancel={() => setIsUserActionVisible(false)}
                      ></LogoutModal>
                    </li>
                    <li>
                      <span
                        className="bg-black/60 mt-2 text-xs ml-auto text-white hover:scale-x-110 hover:bg-black/60 hover:dark:bg-black/80"
                        onClick={() => setIsUserActionVisible(false)}
                      >
                        close
                      </span>
                    </li>
                  </ul>
                )}
              </>
            ) : (
              <>
                <div className="text-xl dark:text-[#e6eef7] text-[#1e293b] hover:scale-110">
                  <Link href="/login">
                    <User />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
