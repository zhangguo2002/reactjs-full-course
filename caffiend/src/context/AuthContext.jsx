import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const { children } = props;
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 注册功能，使用邮箱和密码
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // 登录功能，使用邮箱和密码
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 重置密码功能，发送重置密码的电子邮件
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // 登出功能
  function logout() {
    setGlobalUser(null);
    setGlobalData(null);
    return signOut(auth);
  }

  const value = {
    globalUser,
    globalData,
    setGlobalData,
    isLoading,
    signup,
    login,
    logout,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("当前用户: ", user);
      setGlobalUser(user);
      // 如果没有用户，则清空用户状态并从该监听器中返回
      if (!user) {
        console.log("没有活跃的用户");
        return;
      }

      // 如果有用户，检查该用户是否有数据库中的数据，如果有，则获取这些数据并更新全局状态

      try {
        setIsLoading(true);
        // 首先为文档创建一个引用，然后获取该文档，接着对其进行快照检查是否存在数据
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        let firebaseData = {};
        if (docSnap.exists()) {
          firebaseData = docSnap.data();
          console.log("找到用户数据", firebaseData);
        }
        setGlobalData(firebaseData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
