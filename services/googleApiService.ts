// Fix: Add declarations for gapi and google to resolve 'Cannot find name' errors.
declare const gapi: any;
declare const google: any;

// This is a placeholder for your actual client ID and API key
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = process.env.API_KEY || 'YOUR_API_KEY';

if (CLIENT_ID.startsWith('YOUR_') || API_KEY.startsWith('YOUR_')) {
    console.warn("Google API Client ID or API Key is not configured. Google integrations will not work.");
}

const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/meet/v1/discovery.json',
    'https://www.googleapis.com/discovery/v1/apis/classroom/v1/discovery.json'
];
const SCOPES = [
    'https://www.googleapis.com/auth/meetings.space.created',
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly'
].join(' ');


let tokenClient: any = null;
let gapiInited = false;
let gisInited = false;


/**
 * Initializes the GAPI client.
 */
export const initGapiClient = async (): Promise<void> => {
    if (gapiInited) return;

    await new Promise<void>((resolve, reject) => {
        gapi.load('client', () => {
             gapi.client.init({
                // apiKey is not required for discovery of OAuth-gated APIs and can cause issues.
                // apiKey: API_KEY, 
                discoveryDocs: DISCOVERY_DOCS,
            })
            .then(() => {
                gapiInited = true;
                resolve();
            })
            .catch((error: any) => {
                console.error("Error initializing GAPI client", error);
                reject(new Error("API discovery response missing required fields."));
            });
        });
    });
};


/**
 * Initializes the GIS client.
 */
export const initGisClient = async (): Promise<void> => {
     if (gisInited) return;
     
     await new Promise<void>((resolve, reject) => {
        try {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: () => {}, // Callback is handled by the promise
            });
            gisInited = true;
            resolve();
        } catch (error) {
            console.error("Error initializing GIS client", error);
            reject(error);
        }
    });
};

/**
 * Handles user sign-in and authorization.
 */
export const handleAuthClick = async (): Promise<void> => {
    if (!gapiInited || !gisInited) {
        throw new Error("GAPI and/or GIS clients not initialized.");
    }

    return new Promise<void>((resolve, reject) => {
        tokenClient.callback = (resp: any) => {
            if (resp.error !== undefined) {
                reject(resp);
            }
             gapi.client.setToken({access_token: resp.access_token});
             resolve();
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
             tokenClient.requestAccessToken({prompt: ''});
        }
    });
}

/**
 * Creates a new Google Meet space.
 * @returns The meeting URI if successful, otherwise null.
 */
export const createMeetSpace = async (): Promise<string | null> => {
    try {
        await handleAuthClick();
        const response = await gapi.client.meet.spaces.create({});
        console.log("Meet space created: ", response.result);
        return response.result.meetingUri;
    } catch (error) {
        console.error("Error creating Meet space:", error);
        return null;
    }
};

/**
 * Lists the user's courses from Google Classroom.
 */
export const listCourses = async () => {
    await handleAuthClick();
    const response = await gapi.client.classroom.courses.list({
        courseStates: 'ACTIVE'
    });
    return response.result.courses || [];
};

/**
 * Lists the coursework for a specific course from Google Classroom.
 */
export const listCourseWorks = async (courseId: string) => {
    await handleAuthClick();
    const response = await gapi.client.classroom.courses.courseWork.list({
        courseId: courseId,
    });
    return response.result.courseWork || [];
};