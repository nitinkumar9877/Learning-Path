import { AccessTokenFromRrfreshToken } from '@/services/AuthUser';
import Cookies from "js-cookie";

const GenAccessTokenFromRrfreshToeken = async () => {
    try {
        console.log("1");
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
            return false;
        }
        console.log("2");
        const COOKIESURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ROUTE}refresh-token`;
        console.log("3");
        console.log("This is my refresh cookies", refreshToken);
        console.log("This is my Cookies URL :", COOKIESURL);

        // http://localhost:5555/api/auth/refresh-token public API
        // const config = {
        //   headers: {
        //     Authorization: `Bearer ${refreshToken}`,
        //   },
        // };
        // console.log("refresh-token object is :", config);
        console.log("4");
        const responseData = await AccessTokenFromRrfreshToken(COOKIESURL, refreshToken)
        console.log("5 first");

        if (!responseData) {
            return false;
        }
        console.log("5");
        console.log("response Data :", responseData)
        console.log("responseData.data.user")
        const user = responseData?.data?.user;
        // we got error from their
        if (!user?.id) {
            return false;
        }
        console.log("Access token refreshed successfully.");
        return true;
    } catch (error) {
        console.log("the token is not assign so first login for that....");
        console.log("This is the Error :", error)
        return false
    };
};
export default GenAccessTokenFromRrfreshToeken;
