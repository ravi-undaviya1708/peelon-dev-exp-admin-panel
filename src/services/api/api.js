// export const baseURL = "http://192.168.80.179:8000";
// export const baseURL = "https://api.peelon.co";
// export const baseURL = "http://localhost:8000";
// eslint-disable-next-line no-undef
export const baseURL = process.env.ADMIN_BASE_URL;
export const authURL = `${baseURL}/auth`;
export const hostelAdminURL = `${baseURL}/hostel-admin`;
export const superAdminURL = `${baseURL}/super-admin`;


export const authenticationURL = {
    loginURL: `${authURL}/login`,
    userDetailURL: `${authURL}/user-detail`,
    editUserDetailURL: `${authURL}/user-detail`,
    changePasswordURL: `${authURL}/change-password`
};