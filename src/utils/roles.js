export const ROLE = {
  FREE: 1,
  PREMIUM: 2,
  ADMIN: 3,
};

export function getUserRole() {
  const user = JSON.parse(localStorage.getItem("user"));
  return Number(user?.idrol); 
}

export function isFree() {
  return getUserRole() === ROLE.FREE;
}

export function isPremium() {
  return getUserRole() === ROLE.PREMIUM;
}

export function isAdmin() {
  return getUserRole() === ROLE.ADMIN;
}
