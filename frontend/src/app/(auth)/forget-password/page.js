'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from "../../../stylesSheets/login.module.css";
import { AccessTokenFromRrfreshToeken, OtpSend, UserLogin, UserRegister } from "../../../services/AuthUser.js"
import axios from 'axios';
import { redirect, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import GenAccessTokenFromRrfreshToeken from '@/components/GenAccessTokenFromRrfreshToeken';

export const EmailSendToChild = ({ email }) => {
    return (
        <div>
            <h3>The email recived from ForgetPasswordPage :</h3>
            <p>{email}  </p>
        </div>
    )
}

export default function ForgetPasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: ''
    });
    const [submittedEmail, setsubmittedEmail] = useState(false)
    const [loading, setLoading] = useState(false);

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
        setsubmittedEmail(false);

        const otpEmail = {
            email: formData.email
        };

        // console.log('Login data:', {email: otpEmail.email});

        const APIURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ROUTE}generate-otp`;
        // http://localhost:5555/api/auth/generate-otp  backend api
        console.log("This is my url for fetching data : ", APIURL)

        try {
            const response = await OtpSend(APIURL, otpEmail);
            if (!response) {
                throw new Error("otp is not send to user by the server");
            }
            setsubmittedEmail(true);
            sessionStorage.setItem("userEmail", JSON.stringify(otpEmail));
            router.push("/verify-otp");
        } catch (error) {
            console.error('Error fetching employees:', error);
            setsubmittedEmail(false);
        } finally {
            setLoading(false);
            setsubmittedEmail(false);
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
                        <h2>Forget your account password</h2>
                        <p>Enter your details to forget password.</p>
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

                        <button type="submit" className={styles.submitButton}>
                            Generate OTP <span>→</span>
                        </button>

                        <p className={styles.terms}>
                            By creating an account, you agree to our{' '}
                            <Link href="/terms">Terms of Service</Link> and{' '}
                            <Link href="/privacy">Privacy Policy</Link>.
                        </p>
                    </form>
                    {submittedEmail && (
                        <EmailSendToChild email="formData.email" />
                    )}

                    <div className={styles.loginPrompt}>
                        Create your new account? <Link href="/register">Create new account</Link>
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