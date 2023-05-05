import { useUser } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import FirstSignInWizard from "~/components/FirstSignInWizard/FirstSignInWizard";
import { api } from "~/utils/api";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { data: customer, isFetched } = api.customer.get.useQuery(undefined, {
    enabled: isSignedIn && isLoaded,
  });
  const { data: isFirstLogin, isLoading } = api.auth.isFirstLogin.useQuery(
    undefined,
    {
      enabled: isSignedIn && isLoaded && isFetched,
      onSuccess: (data) => {
        if (data) {
          return;
        }

        if (customer) {
          console.log("TO CUSTOMER!", customer);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          router.push("/customer");
        } else {
          console.log("TO SERVICE PROVIDER!");
        }
      },
    }
  );

  if (!isLoaded || isLoading) {
    return <CircularProgress />;
  }

  if (isFirstLogin) {
    return <FirstSignInWizard />;
  }

  return <div />;
}
