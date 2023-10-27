import { estimateBudget, estimateViews } from '@src/tools/estimate';
import { TiktokCredentials } from '@src/types/credentials';
import { TiktokAdModel } from '@src/types/tiktok-ad-model';
import axios from 'axios';
import dayjs from 'dayjs';

const TIKTOK_ADS_URL =
  'https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/list';

interface TiktokPagination {
  has_more: boolean;
  page: number;
  size: number;
  total_count: number;
}

interface TiktokResponse {
  data: {
    materials: {
      ad_title: string;
      brand_name: string;
      cost: number;
      ctr: number;
      favorite: boolean;
      id: string;
      industry_key: string;
      is_search: boolean;
      like: number;
      objective_key: string;
      tag: number;
      video_info: {
        vid: string;
        duration: number;
        cover: string;
        video_url: Record<string, string>;
        width: number;
        height: number;
      };
    }[];
    pagination: TiktokPagination;
  };
}

interface CollectTiktokAdsParams {
  page: number;
  keyword?: string;
  country_code?: string;
  ad_language?: string;
  industry: string;
  credentials: TiktokCredentials;

  period?: number;
  limit?: number;
  order_by?: string;
}

const DEFAULT_PARAMS: Partial<CollectTiktokAdsParams> = {
  keyword: '',
  period: 30,
  limit: 20,
  order_by: 'for_you',
};

function convertResponseToTiktokAdModelArray(
  response: TiktokResponse,
  language: string
): Omit<TiktokAdModel, 'id' | 'comments' | 'shares' | 'landingPageUrl'>[] {
  const now = dayjs().unix();

  return response.data.materials.map((e) => ({
    adId: e.id,
    likes: e.like,
    ctr: e.ctr,
    budgetEnum: e.cost,

    title: e.ad_title,
    brandName: e.brand_name,
    industryKey: e.industry_key,
    industryGroupCode: e.industry_key.replace('label_', '').slice(0, 2),
    language,
    objectiveKey: e.objective_key,
    videoInfo: {
      id: e.video_info.vid,
      cover: e.video_info.cover,
      urls: e.video_info.video_url,
      width: e.video_info.width,
      height: e.video_info.height,
      duration: e.video_info.duration,
    },

    views: estimateViews(e.like),
    budget: estimateBudget(e.like),
    updatedAt: now,
    createdAt: now,
  }));
}

function transformIndustryCode(code: string) {
  const shape = '00000000000';

  return code + shape.slice(code.length);
}

async function _collectTiktokAds(_params: CollectTiktokAdsParams) {
  const params = { ...DEFAULT_PARAMS, ..._params };
  const url = new URL(TIKTOK_ADS_URL);

  url.searchParams.append('period', String(params.period));
  if (params.keyword) url.searchParams.append('keyword', params.keyword);
  url.searchParams.append('page', String(params.page));
  url.searchParams.append('limit', String(params.limit));
  url.searchParams.append('order_by', params.order_by!);
  if (params.country_code)
    url.searchParams.append('country_code', params.country_code);
  if (params.ad_language)
    url.searchParams.append('ad_language', params.ad_language);
  url.searchParams.append('industry', transformIndustryCode(params.industry));

  const response = await axios.get(url.href, {
    headers: {
      'user-sign': params.credentials.userSign,
      'web-id': params.credentials.webId,
      timestamp: params.credentials.timestamp,
    },
  });

  if (!response.data.data) {
    console.error(`Error: ${response}`);
    console.error(`Code: ${response.data?.code}`);
    console.error(`Message: ${response.data?.msg}`);
  }

  const data = response.data as TiktokResponse;
  const pagination = data.data.pagination;

  return {
    data: convertResponseToTiktokAdModelArray(data, params.ad_language),
    pagination,
  };
}

const MAX_RETRY = 3;

export async function collectTiktokAds(
  _params: CollectTiktokAdsParams,
  retry = 0
) {
  if (retry) console.info(`Retrying collectTiktokAds... (${retry})`);
  try {
    return await _collectTiktokAds(_params);
  } catch {
    if (retry >= MAX_RETRY)
      throw new Error('Max retry collectTiktokAds reached');
    return await collectTiktokAds(_params, retry + 1);
  }
}
