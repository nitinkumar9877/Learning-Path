'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../../stylesSheets/login.module.css';
import { OtpVerify } from '../../../services/AuthUser.js';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailLoaded, setEmailLoaded] = useState(false);

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('userEmail');

        if (!storedEmail) {
            router.replace('/forget-password');
            console.log("!1")
            return;
        }

        try {
            const parsed = JSON.parse(storedEmail);
            console.log("1")

            if (
                !parsed ||
                typeof parsed.email !== 'string' ||
                !parsed.email.trim()
            ) {
                sessionStorage.removeItem('userEmail');
                router.replace('/forget-password');
                return;
            }
            console.log("2")

            // Store email in React state before removing it.
            setEmail(parsed.email.trim());
            console.log("3")
            // sessionStorage.removeItem('userEmail');
            console.log("4")
            setEmailLoaded(true);
            console.log("5")
        } catch {
            console.log("22")
            sessionStorage.removeItem('userEmail');
            console.log("33")
            router.replace('/forget-password');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!/^\d{6}$/.test(otp)) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }

        if (!email) {
            setError('Email is missing. Please request a new OTP.');
            return;
        }

        setLoading(true);
        try {
            const APIURL =
                `${process.env.NEXT_PUBLIC_API_URL}` +
                `${process.env.NEXT_PUBLIC_AUTH_ROUTE}verify-otp`;

            console.log("API URL:", APIURL);
            console.log("Email:", email);
            console.log("OTP:", otp);

            const response = await OtpVerify(APIURL, {
                otp,
                email,
            });

            console.log("Full API response:", response);
            console.log("Response data:", response?.data);

            const data = response?.data ?? response;

            if (data?.success !== true) {
                throw new Error(
                    data?.message || "OTP verification failed"
                );
            }

            setSuccess("OTP verified successfully!");
            router.push("/new-password");

        } catch (err) {
            console.error("OTP verification error:", err);
            console.error("Backend response:", err?.response?.data);

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.msg ||
                err?.message ||
                "Unable to verify OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!emailLoaded) {
        return <p>Checking verification details...</p>;
    }

    return (
        <main className={styles.page}>
            <nav className={styles.navbar}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>L</span>
                    Learn<span>Space</span>
                </Link>

                <p className={styles.navText}>
                    Remember your password?
                    <Link href="/login"> Sign in</Link>
                </p>
            </nav>

            <section className={styles.signupSection}>
                <div className={styles.leftPanel}>
                    <div className={styles.badge}>
                        <span className={styles.dot}></span>
                        SECURE ACCOUNT RECOVERY
                    </div>

                    <h1>
                        Verify your email.
                        <br />
                        <span>Reset your password.</span>
                    </h1>

                    <p className={styles.description}>
                        Enter the six-digit verification code sent to
                        your email address to continue resetting your
                        password.
                    </p>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>✓</span>
                            Secure OTP verification
                        </div>

                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>✓</span>
                            Protect your account
                        </div>

                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>✓</span>
                            Create a new password
                        </div>
                    </div>
                </div>

                <div className={styles.formPanel}>
                    <div className={styles.formHeading}>
                        <span className={styles.eyebrow}>
                            ACCOUNT RECOVERY
                        </span>
                        <h2>Verify your OTP</h2>
                        <p>
                            Enter the code sent to your email address.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className={styles.form}
                    >
                        <div className={styles.inputGroup}>
                            <label>Email address</label>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                aria-label="Email address"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="otp">6-DIGIT OTP</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="Enter your OTP"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(
                                        e.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6)
                                    );
                                    setError('');
                                }}
                                pattern="[0-9]{6}"
                                maxLength={6}
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <p role="alert" className={styles.errorMessage}>
                                {error}
                            </p>
                        )}

                        {success && (
                            <p
                                role="status"
                                className={styles.successMessage}
                            >
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading || otp.length !== 6}
                        >
                            {loading
                                ? 'VERIFYING...'
                                : 'VERIFY OTP'}
                            {!loading && <span> →</span>}
                        </button>

                        <p className={styles.terms}>
                            Your verification code is private.
                            Never share it with anyone.
                        </p>
                    </form>

                    <div className={styles.loginPrompt}>
                        Need a new code?{' '}
                        <Link href="/forget-password">
                            Request another OTP
                        </Link>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                © 2026 LearnSpace. Made for curious minds.
            </footer>
        </main>
    );
}
