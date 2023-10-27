import { TiktokCredentials } from '@src/types/credentials';
import axios from 'axios';

const TIKTOK_AD_DETAILS_URL =
  'https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/detail?material_id=';

interface TiktokAdDetailsResponse {
  code: number;
  msg: string;
  request_id: string;
  data: {
    ad_title: string;
    brand_name: string;
    comment: number;
    cost: number;
    country_code: string[];
    ctr: number;
    favorite: boolean;
    has_summary: boolean;
    highlight_text: string;
    id: string;
    industry_key: string;
    is_search: boolean;
    keyword_list: string[];
    landing_page: string;
    like: number;
    objective_key: string;
    objectives: {
      label: string;
      value: number;
    }[];
    pattern_label: [];
    share: number;
    source: string;
    source_key: number;
    tag: number;
    video_info: {
      vid: string;
      duration: number;
      cover: number;
      video_url: Record<string, string>;
      width: string;
      height: string;
    };
    voice_over: boolean;
  };
}

export async function collectAdDetails(
  adId: string,
  credentials: TiktokCredentials
) {
  const url = `${TIKTOK_AD_DETAILS_URL}${adId}`;

  const response = await axios.get(url, {
    headers: {
      'user-sign': credentials.userSign,
      'web-id': credentials.webId,
      timestamp: credentials.timestamp,
    },
  });

  //   if (!response.data.data) {
  //     console.error(`Error: ${response}`);
  //     console.error(`Code: ${response.data?.code}`);
  //     console.error(`Message: ${response.data?.msg}`);
  //   }

  const data = response.data as TiktokAdDetailsResponse;

  return {
    comments: data.data.comment,
    shares: data.data.share,
    landingPageUrl: data.data.landing_page,
  };
}
