const LIKES_VIEWS_RATIO = 100; // 1 like = 100 views
const AVERAGE_CPM = 10; // $10 per 1000 impressions

export function estimateViews(likes: number) {
  return likes * LIKES_VIEWS_RATIO;
}

export function estimateBudget(likes: number) {
  return (estimateViews(likes) / 1000) * AVERAGE_CPM;
}
