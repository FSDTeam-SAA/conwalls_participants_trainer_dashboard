import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export interface SystemSettingData {
    helpTexts: Array<{ name: string; values: { en: string; de: string } }>;
    roleTypes: Array<{ name: string }>;
    categoryTypes: Array<{ name: string }>;
    measureTypes: Array<{ name: string; values: { en: string; de: string } }>;
}

export function useSystemSettings() {
    const session = useSession();
    const token = (session?.data?.user as { accessToken?: string })?.accessToken;

    return useQuery({
        queryKey: ['system-setting'],
        queryFn: async (): Promise<SystemSettingData> => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/system-setting`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error('Failed to fetch system settings');
            }
            const data = await res.json();
            return data.data?.items?.[0] || {
                helpTexts: [],
                roleTypes: [],
                categoryTypes: [],
                measureTypes: [],
            };
        },
        enabled: !!token,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
