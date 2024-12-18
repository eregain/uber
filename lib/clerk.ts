import { Clerk } from "@clerk/clerk-expo";

// Ensure we're using the correct environment variables
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable",
  );
}

const clerk = new Clerk({
  publishableKey,
});

export default clerk;
