
export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in'
  },
  api: {
    login: '/api/auth/login',
    me: '/api/users/me',
  },
  dashboard: {
    home: '/',
  },
  notAuthorized: '/errors/not-authorized',
  notFound: '/errors/not-found',
  internalServerError: '/errors/internal-server-error',
} as const;
