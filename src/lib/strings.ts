/**
 * Centralized UI strings for the FutureLine application.
 *
 * === i18n Integration Guide ===
 *
 * When ready to add multi-language support (e.g., Arabic, French):
 *
 * 1. Install next-intl:
 *    npm install next-intl
 *
 * 2. Create message files per locale:
 *    /messages/en.json — copy the structure from this file
 *    /messages/ar.json — translate all values
 *
 * 3. Configure next-intl in next.config.js and add the NextIntlClientProvider
 *    in your root layout.
 *
 * 4. Replace usages of `strings.xxx` with `useTranslations('namespace')`
 *    from next-intl. The keys in this file map directly to message namespaces.
 *
 * 5. Update <html lang="en"> in layout.tsx to use the current locale.
 *
 * See: https://next-intl-docs.vercel.app/docs/getting-started
 */

export const strings = {
  brand: {
    name: 'FutureLine',
    tagline: 'Design \u2022 Deploy \u2022 Evolve',
    description: 'AI-driven solutions, professional training, and intelligent digital services.',
    copyright: (year: number) => `\u00A9 ${year} FutureLine. All rights reserved.`,
  },

  nav: {
    courses: 'Courses',
    services: 'Services',
    aiSolutions: 'AI Solutions',
    admin: 'Admin',
    dashboard: 'Dashboard',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    getStarted: 'Get Started',
  },

  footer: {
    training: 'Training',
    allCourses: 'All Courses',
    onlineCourses: 'Online Courses',
    inPersonTraining: 'In-Person Training',
    services: 'Services',
    allServices: 'All Services',
    aiSolutions: 'AI Solutions',
    company: 'Company',
    signIn: 'Sign In',
    createAccount: 'Create Account',
  },

  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try Again',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    noResults: 'No results found',
    confirmDelete: 'Are you sure you want to delete this?',
  },

  errors: {
    unauthorized: 'You are not authorized to perform this action.',
    notFound: 'The requested resource was not found.',
    serverError: 'An unexpected error occurred. Please try again later.',
    validationFailed: 'Please check your input and try again.',
    rateLimited: 'Too many requests. Please wait and try again.',
  },
} as const;
