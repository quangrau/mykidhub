import { auth } from "@/lib/auth/auth.server";

const handler = auth.handler;
export { handler as GET, handler as POST };
