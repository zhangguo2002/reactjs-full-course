import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Authentication(props) {
  const { handleCloseModal } = props;
  const [isRegistration, setIsRegistration] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const { signup, login } = useAuth();

  async function handleAuthenticate() {
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.length < 6 ||
      isAuthenticating
    ) {
      return;
    }
    try {
      setIsAuthenticating(true);
      setError(null);

      if (isRegistration) {
        // 注册用户
        await signup(email, password);
      } else {
        // 登录用户
        await login(email, password);
      }
      handleCloseModal();
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <>
      <h2 className="sign-up-text">{isRegistration ? "注册" : "登录"}</h2>
      <p>{isRegistration ? "创建一个账户！" : "登录你的账户！"}</p>
      {error && <p>❌ {error}</p>}
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="邮箱"
      />
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="********"
        type="password"
      />
      <button onClick={handleAuthenticate}>
        <p>{isAuthenticating ? "验证中..." : "提交"}</p>
      </button>
      <hr />
      <div className="register-content">
        <p>{isRegistration ? "已经有账户？" : "没有账户？"}</p>
        <button
          onClick={() => {
            setIsRegistration(!isRegistration);
          }}
        >
          <p>{isRegistration ? "登录" : "注册"}</p>
        </button>
      </div>
    </>
  );
}
