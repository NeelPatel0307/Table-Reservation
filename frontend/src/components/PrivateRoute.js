import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";
import API from "../services/apiToCall";
import CustomSpinner from "./Common/Spinner";
import { getLexSession } from "../functions/functions";

export default function PrivateRoute() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [loading, setLoading] = useState(false);

  const loadChatBotScript = (id) => {
    const scriptLoaded = window.sessionStorage.getItem("chatboatLoadedFlag");
    if (currentUser) {
      if (!scriptLoaded) {
        Kommunicate.init(id, {
          automaticChatOpenOnNavigation: true,
          popupWidget: true,
        });
        window.sessionStorage.setItem("chatboatLoadedFlag", true);
      }
    }
  };

  const handleResturantOwnerCheck = async () => {
    const resturantLoggedIn = window.localStorage.getItem("resturantLoggedIn");
    if (currentUser && !resturantLoggedIn) {
      const { uid } = currentUser;
      setLoading(true);
      await API.isUserResturantOwner({ userId: uid }, (data) => {
        if (data.success && data.data.userId) {
          loadChatBotScript(process.env.REACT_APP_LEX_RESTURANT_ID);
          navigate("/resturant/");
          window.localStorage.setItem("resturantLoggedIn", true);
          setLoading(false);
        } else if (window.localStorage.getItem("isResturant") == "true") {
          logout();
          window.location.href = "/login?notResturantOwner";
        } else {
          loadChatBotScript(process.env.REACT_APP_LEX_ID);
          setLoading(false);
        }
        setTimeout(() => {
          handleLexSession();
        }, 5000);
      });
    }
  };

  const handleLexSession = async () => {
    const sessionSaved = window.sessionStorage.getItem("lexSessionSaved");

    if (currentUser && !sessionSaved) {
      await API.setLexSession(
        { sessionId: getLexSession(), userId: currentUser.uid },
        (data) => {
          window.sessionStorage.setItem("lexSessionSaved", true);
        }
      );
    }
  };

  useEffect(() => {
    handleResturantOwnerCheck();
  }, []);

  return loading ? (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "88vh" }}
    >
      <CustomSpinner />
    </div>
  ) : currentUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}
