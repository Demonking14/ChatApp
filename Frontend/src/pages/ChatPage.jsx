

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function ChatPage() {
 
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // Only run when authUser is available
  });


 useEffect(() => {
  const initChat = async () => {
    if (!STREAM_API_KEY || !tokenData?.token || !authUser) return;

    if (chatClient?.user?.id === authUser._id) {
      // Already connected
      return;
    }

    try {
      const client = StreamChat.getInstance(STREAM_API_KEY);

      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData.token
      );

      const ChannelId = [authUser._id, targetUserId].sort().join("-");
      const CurrChannel = client.channel("messaging", ChannelId, {
        members: [authUser._id, targetUserId],
      });

      await CurrChannel.watch();
      setChatClient(client);
      setChannel(CurrChannel);
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Could not connect to chat. Please try again");
    } finally {
      setLoading(false);
    }
  };

  initChat();


  
}, [tokenData?.token, authUser?._id, targetUserId]);


const handleVideoCall = ()=>{
  if(channel){
    const callUrl = `${window.location.origin}/call/${channel.id}`;
    channel.sendMessage({
      text:`I've started a video call. Join me here ${callUrl}`,
    })
    toast.success("Video call link sent successfully")

  }

}

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient} theme="team dark">
        <Channel channel={channel} className="w-full relative">
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread/>
        </Channel>
      </Chat>
    </div>
  );
}

export default ChatPage;