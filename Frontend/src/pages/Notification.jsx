import React from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getFriendRequest, acceptFriendRequest } from '../lib/api';
import { UserCheckIcon, BellIcon, ClockIcon, MessageSquareIcon } from 'lucide-react';
import NoNotificationFound from '../components/NoNotificationFound';
import Footer from './footer';

function Notification() {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequest"],
    queryFn: getFriendRequest
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }
  });

  const incomingRequest = friendRequests?.incomingRequest || [];
  const acceptedRequest = friendRequests?.acceptedRequest || [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='container mx-auto max-w-4xl space-y-8'>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-6'> 
            Notifications
          </h1>

          {isLoading ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : (
            <>
              {incomingRequest.length > 0 && (
                <section className='space-y-4'>
                  <h2 className='text-xl font-semibold flex items-center gap-2'>
                    <UserCheckIcon className="h-5 w-5 text-primary" />
                    Friend Requests
                    <span className='badge badge-primary ml-2'>{incomingRequest.length}</span>
                  </h2>

                  <div className='space-y-3'>
                    {incomingRequest.map((request) => (
                      <div
                        key={request._id}
                        className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow'
                      >
                        <div className='card-body p-4'>
                          <div className='flex items-center justify-between'>
                            <div className="flex items-center gap-3">
                              <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                <img
                                  src={request?.sender?.profilePic}
                                  alt={request?.sender?.fullName}
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold">{request?.sender?.fullName}</h3>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className="badge badge-secondary badge-sm">
                                    Native: {request?.sender?.nativeLanguage}
                                  </span>
                                  <span className="badge badge-outline badge-sm">
                                    Learning: {request?.sender?.learningLanguage}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={isPending}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {acceptedRequest.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BellIcon className="h-5 w-5 text-success" />
                    New Connections
                  </h2>

                  <div className="space-y-3">
                    {acceptedRequest.map((notification) => (
                      <div key={notification._id} className="card bg-base-200 shadow-sm">
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={notification?.recipient?.profilePic}
                                alt={notification?.recipient?.fullName}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{notification?.recipient?.fullName}</h3>
                              <p className="text-sm my-1">
                                {notification?.recipient?.fullName} accepted your friend request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                            </div>
                            <div className="badge badge-success">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {incomingRequest.length === 0 && acceptedRequest.length === 0 && (
                <NoNotificationFound />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Notification;
