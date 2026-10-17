'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from "../../../stylesSheets/login.module.css";
import { AccessTokenFromRrfreshToeken, UserLogin } from "../../../services/AuthUser.js"
import { redirect, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import GenAccessTokenFromRrfreshToeken from '@/components/GenAccessTokenFromRrfreshToeken';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const myFun = async ()=>{
      const response = await GenAccessTokenFromRrfreshToeken();
      console.log("i got response :",response)
      if(response){
        router.replace("/profile")
      }
    }
    myFun()
  }, []);

  if (loading) {
    return <>The Data have to check...</>
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginUser = {
      email: formData.email,
      password: formData.password,
    };

    console.log('Login data:', {
      email: loginUser.email,
      password: loginUser.password,
    });

    const APIURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ROUTE}login-user`;
    // http://localhost:5555/api/auth/login-page  backend api
    console.log("This is my url for fetching data : ", APIURL)

    // Next step: connect your register API here.
    try {
      const response = await UserLogin(APIURL, loginUser);

      const accessToken = response.data.accessToken;
      // alert("user Login successfully")
      // router.push("/profile");
      if (!accessToken) {
        throw new Error("Access token was not returned by the server");
      }
      // sessionStorage.setItem("accessToken", accessToken);
      router.push("/profile");
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <main className={styles.page}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>L</span>
          Learn<span>Space</span>
        </Link>

        <p className={styles.navText}>
          Create Your new Account?
          <Link href="/register"> Sign up</Link>
        </p>
      </nav>

      <section className={styles.signupSection}>
        <div className={styles.leftPanel}>
          <div className={styles.badge}>
            <span className={styles.dot}></span>
            YOUR LEARNING JOURNEY STARTS HERE
          </div>

          <h1>
            Learn new skills.
            <br />
            <span>Build your future.</span>
          </h1>

          <p className={styles.description}>
            Join a community of learners, explore new
            opportunities, and take the next step toward
            your goals.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              Learn at your own pace
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              Track your learning progress
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              Access your courses in one place
            </div>
          </div>

          <div className={styles.decorativeCard}>
            <div className={styles.bookIcon}>✦</div>
            <div>
              <strong>Your next chapter begins today.</strong>
              <p>Small steps lead to big achievements.</p>
            </div>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.formHeading}>
            <span className={styles.eyebrow}>KEEP LEARNING</span>
            <h2>Login your account</h2>
            <p>Enter your details to Login LearnSpace.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className={styles.showPassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {/* 
            <button type="submit" className={styles.submitButton}>
              Create account <span>→</span>
            </button> */}

            <button type="submit" className={styles.submitButton}>
              Create account <span>→</span>
            </button>

            <p className={styles.terms}>
              By creating an account, you agree to our{' '}
              <Link href="/terms">Terms of Service</Link> and{' '}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </form>

          <div className={styles.loginPrompt}>
            Create your new account? <Link href="/forget-password">Forget Your Password</Link>
          </div>
          <div className={styles.loginPrompt}>
            Create your new account? <Link href="/register">Resgister a user</Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        © 2026 LearnSpace. Made for curious minds.
      </footer>
    </main>
  );
}
