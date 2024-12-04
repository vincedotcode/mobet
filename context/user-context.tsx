import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
  import { useSession } from "next-auth/react";
  import { getUserByEmail } from "@/lib/actions/user.actions";
  
  const UserContext = createContext<any>(null);
  export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const [user, setUser] = useState({
      firstName: "John",
      lastName: "Doe",
      isAdmin: false,
      isEmailVerified: false,
      role: "user",
      id: "",
    });
  
    useEffect(() => {
      const fetchUser = async () => {
        if (session?.user?.email) {
          const fetchedUser = await getUserByEmail(session.user.email);
          console.log("fetchedUser", fetchedUser);
          setUser({
            firstName: fetchedUser?.firstName || "John",
            lastName: fetchedUser?.lastName || "Doe",
            isAdmin: fetchedUser?.isAdmin || false,
            isEmailVerified: fetchedUser?.isEmailVerified || false,
            role: fetchedUser?.role || "user",
            id: fetchedUser?._id || "",
          });
        }
      };
      fetchUser();
    }, [session?.user?.email]);
  
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  };
  
  export const useUser = () => useContext(UserContext);