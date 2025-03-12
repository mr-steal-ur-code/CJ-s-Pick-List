export default function isAllowedShare(userId: string) {
  const allowedUserIds = ["1E2Jn65K0dUyVkEWQAcPxtrrXQj2", "IQJq6y6Ti9b9514Va20ylcm40XN2"];

  return allowedUserIds.includes(userId);
}