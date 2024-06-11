import { PROD_API_URL } from "@/constants/constants";

const linkAdapter = (link: string) => {
    const linkUrl = `${PROD_API_URL}${link}`;
    return linkUrl;
};

export default linkAdapter;