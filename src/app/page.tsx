import PostForm from "@/components/home/PostForm";
import UserInformation from "@/components/home/UserInformation";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="mt-5 grid grid-cols-8 gap-2 sm:px-5">
      <section className="hidden md:col-span-2 md:inline">
        <UserInformation />
      </section>

      <section className="col-span-full h-fit w-[90%] max-md:mx-auto md:col-span-6 md:w-full xl:col-span-4 xl:mx-auto xl:max-w-xl">
        {user && <PostForm />}
      </section>

      <section className="hidden justify-center xl:col-span-2 xl:inline"></section>
    </div>
  );
}
