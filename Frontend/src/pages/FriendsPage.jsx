import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriends from "../components/NoFriends";
import Footer from "./footer";

function Friends() {
  const {
    data: userFriendsData = { friends: [] },
    isLoading,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const userFriends = userFriendsData.friends || [];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Your Friends</h1>
            <p className="text-base-content opacity-70 mt-1">
              These are the people you're connected with.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : userFriends.length === 0 ? (
            <NoFriends />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userFriends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Friends;
