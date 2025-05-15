import React, { useState, useEffect } from "react";
import { getAuthUser } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { LoaderIcon } from "react-hot-toast";
import { completeOnBoarding } from "../lib/api";
import { CameraIcon, MapPin, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

function OnBoarding() {
  const [authUser, setAuthUser] = useState(null); // State to store user data
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: "",
  });

  // Fetch user data asynchronously
  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const user = await getAuthUser();
        setAuthUser(user); // Update authUser state
      } catch (error) {
        console.error("Error fetching auth user:", error);
      }
    };
    fetchAuthUser();
  }, []);

  // Update formState when authUser is fetched
  useEffect(() => {
    if (authUser) {
      setFormState((prevState) => ({
        ...prevState,
        fullName: authUser.user.fullName || "",
        bio: authUser.user.bio || "",
        nativeLanguage: authUser.user.nativeLanguage || "",
        learningLanguage: authUser.user.learningLanguage || "",
        location: authUser.user.location || "",
        profilePic: authUser.user.profilePic || "",
      }));
    }
  }, [authUser]);

  const { mutate: onBoardingMutation, isPending } = useMutation({
    mutationFn: completeOnBoarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onBoardingMutation(formState);
  };

  if (!authUser) {
    // Show a loading state while fetching user data
    return <div>Loading...</div>;
  }

  const handleRandomAvatar = () => {
    const index = Math.floor(Math.random() *100)+1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`
    setFormState({...formState, profilePic:randomAvatar});
    toast.success("Random profile Picture genearted ")
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Pic */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate random avatar btn */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* FullName */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/*Languages */}
            <div className="grid gird-col-1 md:grid-col-2 gap-4">
              {/* Native language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPin className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70"/>
                <input 
                type="text"
                name="location"
                value={formState.location}
                onChange={(e)=>setFormState({...formState , location:e.target.value})}
                className="input input-bordered w-full pl-10"
                placeholder="City, Country"/>

              </div>
            </div>


            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                <ShipWheelIcon className="size-5 mr-2"/>
                Complete OnBoarding
                </>
              ) : (
                <>
                <LoaderIcon className=" animate-spin size-5 mr-2"/>
                Onboarding...
                </>
              )}

            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnBoarding;
