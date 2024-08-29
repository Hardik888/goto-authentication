const initialState: AuthState = {
  isLoading: false,
  isError: null,
  user: null,
  handleresponse: null,
  accesstoken: '',
  refreshtoken: '',
};
type AuthProviderProps = {
  children: ReactNode;
  authUrl: string;
  fetchDataFn: <T>(token: string) => Promise<T>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  authUrl,
  fetchDataFn,
}) => {

const [state, setState] = useState<AuthState>(initialState);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    if (token) {
      checkLoggedIn();
    }
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await axios.post(authUrl, { username: email, password: password });
      const { access, refresh } = response.data;

      setState((prev) => ({
        ...prev,
        isLoading: false,
        user: email,
        accesstoken: access,
        refreshtoken: refresh,
      }));
      localStorage.setItem('authToken', access);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isError: 'Invalid Credentials',
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setState(initialState);
    setIsAuthenticated(false);
  };

  const checkLoggedIn = () => {
    const token = localStorage.getItem('authToken');

    if (token ) {
      setState((prev) => ({
        ...prev,
        accesstoken: token,
        user: user,
      }));
      return true;
    }
    return false;
  };

  const fetchData = <T>(key: string, fetchFn: (token: string) => Promise<T>) => {
    const token = localStorage.getItem('authToken');
    const { data, isLoading, isError } = useQuery<T>({
      queryKey: [key, token],
      queryFn: () => token ? fetchFn(token) : Promise.reject('No token'),
    });

    return { data, isLoading, isError };
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        isLoading: state.isLoading,
        isError: state.isError,
        checkLoggedIn,
        setIsError: (error: string | null) => setState((prev) => ({ ...prev, isError: error })),
        setHandleResponse: (response: any) => setState((prev) => ({ ...prev, handleresponse: response })),
        fetchData,
      }}
    >
      {isAuthenticated ? children : <div>Please log in</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
