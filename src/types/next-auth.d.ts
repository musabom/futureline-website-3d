import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      name: string;
      email: string;
      role: 'ADMIN' | 'INSTRUCTOR' | 'CUSTOMER';
    };
  }

  interface User {
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'INSTRUCTOR' | 'CUSTOMER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'ADMIN' | 'INSTRUCTOR' | 'CUSTOMER';
    id: string;
    firstName: string;
    lastName: string;
  }
}
