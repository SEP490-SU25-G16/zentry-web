import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
// GLOBAL CUSTOM COMPONENTS
import Loading from "app/components/MatxLoading";
import { instance } from "lib/axios";

const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const setSession = (accessToken, user = null) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common.Authorization;
    delete instance.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FB_AUTH_STATE_CHANGED": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }
    default: {
      return state;
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: "API"
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const signInWithEmail = async (email, password) => {
    try {
      const { data } = await instance.post("/auth/sign-in", { email, password });

      if (data.Success && data.Data) {
        const { Token, UserInfo } = data.Data;

        const user = {
          id: UserInfo.Id,
          email: UserInfo.Email,
          avatar: null,
          role: UserInfo.Role,
          name: UserInfo.FullName
        };

        setSession(Token, user);
        dispatch({
          type: "FB_AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: true,
            user
          }
        });
        return data;
      } else {
        throw new Error("Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data } = await instance.post("/auth/google-signin");

      if (data.Success && data.Data) {
        const { Token, UserInfo } = data.Data;

        const user = {
          id: UserInfo.Id,
          email: UserInfo.Email,
          avatar: null,
          role: UserInfo.Role,
          name: UserInfo.FullName
        };

        setSession(Token, user);
        dispatch({
          type: "FB_AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: true,
            user
          }
        });
        return data;
      } else {
        throw new Error(data.Message || "Đăng nhập Google thất bại");
      }
    } catch (error) {
      throw error;
    }
  };

  const createUserWithEmail = async (email, password, name) => {
    try {
      const { data } = await instance.post("/auth/sign-up", { email, password, name });

      if (data.Success && data.Data) {
        const { Token, UserInfo } = data.Data;

        const user = {
          id: UserInfo.Id,
          email: UserInfo.Email,
          avatar: null,
          role: UserInfo.Role,
          name: UserInfo.FullName
        };

        setSession(Token, user);
        dispatch({
          type: "FB_AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: true,
            user
          }
        });
        return data;
      } else {
        throw new Error(data.Message || "Đăng ký thất bại");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setSession(null);
    dispatch({
      type: "FB_AUTH_STATE_CHANGED",
      payload: { isAuthenticated: false, user: null }
    });
  };

  useEffect(() => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const userStr = window.localStorage.getItem("user");

      if (accessToken && userStr) {
        const user = JSON.parse(userStr);
        setSession(accessToken, user);
        dispatch({
          type: "FB_AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: true,
            user
          }
        });
      } else {
        setSession(null);
        dispatch({
          type: "FB_AUTH_STATE_CHANGED",
          payload: { isAuthenticated: false, user: null }
        });
      }
    } catch (err) {
      setSession(null);
      dispatch({
        type: "FB_AUTH_STATE_CHANGED",
        payload: { isAuthenticated: false, user: null }
      });
    }
  }, []);

  if (!state.isInitialized) return <Loading />;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        logout,
        signInWithGoogle,
        method: "API",
        signInWithEmail,
        createUserWithEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
