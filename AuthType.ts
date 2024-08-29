export type AuthState = {
  isLoading: boolean;
  isError: string | null;
  user: string | null;
  handleresponse: any;
  accesstoken: string;
  refreshtoken: string;
};

export type AuthContextType = {
  state: AuthState;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isError: string | null;
  checkLoggedIn: () => boolean;
  setIsError: (error: string | null) => void;
  setHandleResponse: (response: any) => void;
  fetchData: <T>(key: string, fetchFn: (token: string) => Promise<T>) => {
    data: T | undefined;
    isLoading: boolean;
    isError: any;
  };
};
