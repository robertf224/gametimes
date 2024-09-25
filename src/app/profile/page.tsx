import { auth } from "@/logic/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();
    if (!session) {
        redirect("/");
    }
    return (
        <div className="flex px-5 py-5 sm:px-10">
            {session.user?.name && <h1>Hello, {session.user.name}</h1>}
        </div>
    );
}
