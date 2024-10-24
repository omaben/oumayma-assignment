import { User, UserRole } from '@/types/user';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';

/**
 * Converts a date to a date with the specified timezone and format.
 * @param {Date} date - The date to convert.
 * @param {string} timezone - The target timezone (e.g., 'America/New_York').
 * @returns {string} A formatted date string.
 */
export const convertDateToDateByTimeZone = (date: Date, timezone: string) => {
    return moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss:SSS');
};

export const timedifference = new Date().getTimezoneOffset();

export function stringToHash(input: string): string {
    if (input && input.length > 10) {
        const truncatedHash = input.slice(0, 4) + '...' + input.slice(-5);
        return truncatedHash;
    } else {
        return input;
    }
}

export const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });


export const handleFormat = (
    number: number,
    displayCurrency?: string,
    formatter?: boolean,
    hideCurrency?: boolean
): string => {
    // const currencies = store.getState().auth.currenciesInit;
    // const maximumDigits: any = currencies?.find(
    //     (item: any) => item.currency === displayCurrency
    // );

    const maximumDigits: any = null
    const formattedNumber = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits:
            displayCurrency === 'USD'
                ? Math.min(2, (number.toString().split('.')[1] || '')?.length) || 0
                : maximumDigits?.acceptedDecimals || 2,
        compactDisplay: 'short',
        notation: formatter ? 'compact' : 'standard',
    }).format(number < 0 ? number * -1 : number);

    const numberWithCurrency = `${number < 0 ? '-' : ''}${displayCurrency === 'USD' && !hideCurrency ? '$' : ''
        }${formattedNumber}`;
    return numberWithCurrency;
};


export const checkUserHasRoles = (user: User, rolesToCheck: string[]) => {
    if (!user || !user.role) {
        return false;
    }

    return rolesToCheck.some(role => user.role.includes(role as UserRole));
};

export type JsonType =
    | 't' // string
    | 'k' // key
    | 'i' // integer
    | 'f' // float
    | 'b' // boolean
    | 'date'; // date or timestamp

export type FlattenedJson = {
    [key: string]: {
        value: any;
        type: JsonType;
    };
};

function getType(value: any): JsonType {
    if (typeof value === 'string') {
        // Detect UUID or other "key" values based on length and structure
        if (/[0-9a-fA-F\-]{36}/.test(value)) {
            return 'k'; // Assuming UUID is a key
        }

        // Detect ISO date string
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
            return 'date'; // ISO 8601 formatted date string
        }

        return 't'; // Regular string
    }
    if (typeof value === 'number') {
        if (Number.isInteger(value)) {
            // Assuming timestamp values based on their size
            return value > 1000000000000 ? 'date' : 'i';
        }
        return 'f'; // Float numbers
    }
    if (typeof value === 'boolean') {
        return 'b'; // Boolean type
    }
    return 't'; // Default fallback for unknown types
}