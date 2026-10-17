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
        name: '',
        username: '',
        email: '',
        phonenum: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

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

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        };

        const registerUser = {
            name: formData.name,
            username: formData.username,
            email: formData.email,
            phonenum: formData.phonenum,
            password: formData.password,
        };

        console.log('Signup data:', {
            name: registerUser.name,
            username: registerUser.username,
            email: registerUser.email,
            phonenum: registerUser.phonenum,
            password: registerUser.password,
        });

        const APIURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ROUTE}register-user`
        // http://localhost:5555/api/auth/register-user backend api
        console.log("This is my url for fetching data : ", APIURL)

        // Next step: connect your register API here.
        try {
            const response = await UserRegister(APIURL, registerUser);
            alert("user create successfully")
            router.replace('/profile')
        } catch (error) {
            console.error('Error fetching employees:', error);
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
                        <h2>Create your account</h2>
                        <p>Enter your details to join LearnSpace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Full name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                autoComplete="username"
                                minLength={3}
                                required
                            />
                        </div>

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
                            <label htmlFor="phonenum">Phone number</label>
                            <input
                                id="phonenum"
                                name="phonenum"
                                type="tel"
                                placeholder="Enter your phone number"
                                value={formData.phonenum}
                                onChange={handleChange}
                                autoComplete="tel"
                                inputMode="numeric"
                                minLength={10}
                                maxLength={10}
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
                        Already a member? <Link href="/login">Sign in</Link>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                © 2026 LearnSpace. Made for curious minds.
            </footer>
        </main>
    );
}
