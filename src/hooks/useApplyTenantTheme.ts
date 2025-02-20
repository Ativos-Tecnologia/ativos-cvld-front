import { useEffect } from 'react';
import { getTenantFromUrl } from '@/utils/getHostFromUrl';
import { tenantThemes } from '@/css/tenantThemes';

const useApplyTenantTheme = () => {
    useEffect(() => {
        const applyTheme = () => {
            const tenant = getTenantFromUrl();
            const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
            const themeConfig =
                tenantThemes[tenant as keyof typeof tenantThemes] || tenantThemes['dev'];
            const themeVars = themeConfig[mode];

            Object.keys(themeVars).forEach((key) => {
                document.documentElement.style.setProperty(
                    key,
                    themeVars[key as keyof typeof themeVars],
                );
            });
        };

        applyTheme();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    applyTheme();
                }
            });
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => {
            observer.disconnect();
        };
    }, []);
};

export default useApplyTenantTheme;
