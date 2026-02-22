import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'ADMIN' | 'INSTRUCTOR' | 'CUSTOMER';
    };
  }

  interface User {
    role: 'ADMIN' | 'INSTRUCTOR' | 'CUSTOMER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'ADMIN' | 'INSTRUCTOR' | 'CUSTOMER';
    id: string;
  }
}
