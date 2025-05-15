import React from "react";
import { Navigate, Route, Routes } from "react-router";
import {
  Home,
  Login,
  Logout,
  Notification,
  OnBoarding,
  SignUp,
  CallPage,
  ChatPage,
} from "./pages/index";
import PageLoader from "./components/pageLoader";
import useAuthUser from "./hooks/useAuthUser";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  // const {theme} = useThemeStore();
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const {theme} = useThemeStore()

  const isOnBoarded = authUser?.isOnBoard;

  if (isLoading) return <PageLoader />;
  return (
    <div className="h-screen" data-theme ={theme} >
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnBoarded ? (
             <Layout showSidebar ={true}><Home/></Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Navigate to={isOnBoarded ? "/" : "/onboarding"}/>}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/logout"
          element={isAuthenticated ? <Logout /> : <Navigate to={isOnBoarded ? "/ " : "/onboarding"} />}
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnBoarded ? ( <Layout showSidebar>
              <Notification/>
              </Layout>) : (<Navigate to={!isAuthenticated ? "/login" : 
                "/onboarding"
              }/>)
          }
        />
        <Route
          path="/onboarding"
          element={isAuthenticated ? (
            !isOnBoarded ? (<OnBoarding/>) : (
              <Navigate to="/login"/>
            )
          ) : <Navigate to="/login" />}
        />
        <Route
          path={`/chat/:id`}
          element={isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <ChatPage/>
            </Layout>
          ): (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
          )}
        />
        <Route
          path="/call/:id"
          element={isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <CallPage/>
            </Layout>
          ): (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
          )}
        />
      </Routes>
      
    </div>
  );
}

export default App;
