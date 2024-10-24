import { toast } from '@/components/core/toaster';
import { timedifference } from '@/lib/helper';
import { CurrentTimezoneState } from '@/types/common';
import { User } from '@/types/user';
import axios from 'axios';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

export async function handleApiRequest<T>(
    url: string,
    params: any,
    errorMessage: string
) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...params }),
        });
        console.log('API response:', response, params);
        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Invalid credentials' };
        }

        const data = await response.json();
        const success = data.success || !data.error;

        if (success) {
            return {
                data,
            };
        } else {
            if (data.errorCode === '4001') {
                localStorage.removeItem('custom-auth-token');
                window.location.reload();
            } else {
                toast.error(data.message ?? 'Invalid response from server', { position: 'top-center' });
            }
            return { error: 'Invalid response from server' };
        }
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: errorMessage };
        }
    }
}
export async function handleApiRequestOld<T>(
    req: NextApiRequest,
    res: NextApiResponse,
    endpoint: string,
    postData: any
) {
    try {
        const baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '';
        const cookie: string | undefined = req.headers.cookie;
        if (!cookie) {
            // return res.status(401).json({ message: 'Authorization token is missing' });
        }
        // Function to parse the cookie string and get the access_token
        const getAccessTokenFromCookie = (cookieString: string) => {
            const match = cookieString.match(/access_token=([^;]+)/);
            return match ? match[1] : null;
        };

        const token = cookie ? getAccessTokenFromCookie(cookie) : '';
        if (!token) {
            // return res.status(401).json({ message: 'Access token is missing' });
        }

        const headers = {
            'Content-Type': 'application/json',
            authorization: token,
        };
        const response = await axios.post(`${baseUrl}${endpoint}`, postData, { headers });
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.log('error')
        return res.status(error?.response?.data?.statusCode || 500).json(error?.response?.data);
    }
}

export function getAuthorizationToken(req: NextApiRequest, res: NextApiResponse): string | null {
    const cookie = req.headers.cookie;
    if (!cookie) {
        res.status(401).json({ message: 'Authorization token is missing' });
        return null;
    }

    const token = getAccessTokenFromCookie(cookie);
    if (!token) {
        res.status(401).json({ message: 'Authorization token is missing' });
        return null;
    }

    return token;
}

// src/helpers/api.ts
export async function handleApiError(res: NextApiResponse, error: any) {
    console.error('API Error:', error);
    return res.status(400).json({ message: 'Internal error', details: error.message || 'Unknown error' });
}


export async function handleApiRequestGetStake<T>(
    req: NextApiRequest,
    res: NextApiResponse,
    endpoint: string,
    postData: any
) {
    try {
        const cookie: string | undefined = req.headers.cookie;
        if (!cookie) {
            // return res.status(401).json({ message: 'Authorization token is missing' });
        }
        // Function to parse the cookie string and get the access_token
        const getAccessTokenFromCookie = (cookieString: string) => {
            const match = cookieString.match(/access_token=([^;]+)/);
            return match ? match[1] : null;
        };

        const token = cookie ? getAccessTokenFromCookie(cookie) : '';
        if (!token) {
            // return res.status(401).json({ message: 'Access token is missing' });
        }
        const response = await axios.get(`${endpoint}`, postData);
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.log('error')
        return res.status(error?.response?.data?.statusCode || 500).json(error?.response?.data);
    }
}

export function getDateUnixTimestamp(date: string | Date, timezone: CurrentTimezoneState) {
    return Math.round(new Date(date).getTime() / 1000 - timedifference * 60 + timezone.timezoneOffset * 60);
}

export function getDateUnixTimestampFilter(date: string) {
    const d = new Date(date);
    d.setSeconds(0, 0); // Set seconds and milliseconds to 0
    return Math.round(d.getTime() / 1000);
}


export function setDateFromUnixTimestamp(date: string, timezone: CurrentTimezoneState) {
    return dayjs((parseInt(date) + timedifference * 60 - timezone?.timezoneOffset * 60) * 1000).format('YYYY-MM-DD HH:mm');
}

export function formatDate(value: string) {
    return dayjs(value).format('YYYY-MM-DD HH:mm')
}

export const getAccessTokenFromCookie = (cookieString: string) => {
    const match = cookieString.match(/access_token=([^;]+)/);
    return match ? match[1] : null;
};

// export const stringToBoolean = (str: string) => {
//     return str.toLowerCase() === 'true';
// }

export const stringToBoolean = (str: string) => {
    return ["true", "1", "yes"].includes(str.toLowerCase());
};

