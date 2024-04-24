import { auth } from "@/auth";
import AuthorizedCallback from "@/components/authorized-clalback";

const Authorize = async () => {
  const session = await auth();
  return <AuthorizedCallback session={session} />;
};

export default Authorize;
