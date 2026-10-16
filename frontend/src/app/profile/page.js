"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "../../stylesSheets/profile.module.css";
import { DeleteUser, UserLogout, UserProfile } from "@/services/AuthUser";
import GenAccessTokenFromRrfreshToeken from "@/components/GenAccessTokenFromRrfreshToeken";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
    const [userData, setuserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    // const [reRener, setreRender] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let accessToken = Cookies.get("accessToken");

                console.log("Access token:", accessToken);
                if (!accessToken) {
                    const responseUser = await GenAccessTokenFromRrfreshToeken();
                    if (!responseUser) {
                        router.replace("/login");
                        return;
                    }
                    accessToken = Cookies.get("accessToken")
                }

                const APIURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ROUTE}profile`;
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };
                const responseData = await UserProfile(APIURL, config);
                const user = responseData.data.userData;
                console.log("Fetched profile:", user);
                setuserData({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phonenum: user.phonenum,
                });
            } catch (err) {
                console.error(
                    "Profile fetch error:",
                    err.response?.data || err.message
                );
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch profile."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        const APIURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ROUTE}logout`
        console.log("This is the logout url :", APIURL)
        const response = await UserLogout(APIURL);
        if (!response) {
            error.message("Fail to login")
        }
        router.replace("/login")
    }

    const handleDelete = async () => {
        try {
            const APIURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ROUTE}delete-profile`;
            const accessToken = Cookies.get('accessToken');
            if (!accessToken) {
                return;
            }
            console.log("accessToken :", accessToken);
            const response = await DeleteUser(APIURL, accessToken);
            if (!response) {
                return;
            }
            router.replace("/register");
        } catch (err) {
            console.log('error status for delete', err.status);
            console.log('error msg for delete', err.message);
            console.log('error type for delete', err.type);
        }
    }

    if (loading) {
        return <div className={styles.profilePage}>Loading profile...</div>;
    }

    if (error) {
        return <div className={styles.profilePage}>{error}</div>;
    }

    return (
        <div className={styles.profilePage}>
            <h1>My Profile</h1>

            {userData && (
                <div>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Phone:</strong> {userData.phonenum}</p>
                    <button onClick={handleLogout}>Logout The profile</button>
                    <button onClick={handleDelete}>Delete The profile</button>

                </div>
            )}
        </div>
    );
};

export default ProfilePage;