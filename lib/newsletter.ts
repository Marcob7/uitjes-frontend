import { getApiBase } from "@/lib/api";

export type NewsletterSignupInput = {
  email: string;
  preferred_city?: string;
  city?: string;
  frequency?: "weekly" | "weekend" | "monthly";
  interests?: Array<
    "festivals" | "events" | "food_drink" | "family" | "surprise"
  >;
  source?: string;
};

export type NewsletterSignupResponse = {
  ok: boolean;
  message: string;
  errors?: Record<string, unknown>;
};

export async function signupForNewsletter(
  input: NewsletterSignupInput
): Promise<NewsletterSignupResponse> {
  let response: Response;

  try {
    response = await fetch(`${getApiBase()}/api/newsletter/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(input),
    });
  } catch {
    return {
      ok: false,
      message:
        "Aanmelden lukt nu niet. Controleer of de backend lokaal draait en probeer het opnieuw.",
    };
  }

  const data = (await response.json().catch(() => null)) as
    | NewsletterSignupResponse
    | null;

  if (data?.message) {
    return data;
  }

  return {
    ok: false,
    message: "Aanmelden is niet gelukt. Probeer het later opnieuw.",
  };
}
