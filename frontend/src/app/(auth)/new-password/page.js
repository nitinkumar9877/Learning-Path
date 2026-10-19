'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from "../../../stylesSheets/register.module.css";
import { UserRegister } from "../../../services/AuthUser.js"
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    if (loading) {
        return <>The Data have to check</>
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
        console.log("Password :", formData.password);
        console.log("Confirm Password :", formData.confirmPassword);
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            setLoading(false);
            return;
        };

        const registerUser = {
            email: formData.email,
            phonenum: formData.phonenum,
            password: formData.password,
        };
        const APIURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ROUTE}new-password`
        // http://localhost:5555/api/auth/new-password backend api
        console.log("This is my url for fetching data : ", APIURL)

        // Next step: connect your register API here.
        try {
            const response = await UserRegister(APIURL, registerUser);
            alert("password update successfully")
            router.replace('/login')
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
                    Already have an account?
                    <Link href="/login"> Log in</Link>
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
                        <span className={styles.eyebrow}>GET STARTED FOR FREE</span>
                        <h2>Change your password</h2>
                        <p>Enter your reset your password in LearnSpace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    minLength={8}
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

                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password again"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <button type="submit" className={styles.submitButton}><Link href='/profile'>
                            Change Password <span>→</span>
                        </Link>
                        </button>

                        <p className={styles.terms}>
                            By creating an account, you agree to our{' '}
                            <Link href="/terms">Terms of Service</Link> and{' '}
                            <Link href="/privacy">Privacy Policy</Link>.
                        </p>
                    </form>
                    <div className={styles.loginPrompt}>Login your accounts? <Link href="/login">Sign in</Link></div>
                    <div className={styles.loginPrompt}>register a new accounts? <Link href="/register">Sign in</Link></div>
                </div>
            </section>

            <footer className={styles.footer}>
                © 2026 LearnSpace. Made for curious minds.
            </footer>
        </main>
    );
}
