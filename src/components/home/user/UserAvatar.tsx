import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/types/user";

type Props = {
  user?: IUser;
};

const UserAvatar = ({ user }: Props) => {
  return (
    <Avatar>
      <AvatarImage
        src={user?.imageUrl || "/avatar.png"}
        alt={`${user?.firstName} ${user?.lastName} avatar` || "avatar"}
      />
      <AvatarFallback>
        {user?.firstName?.charAt(0) || "A"}{" "}
        {user ? user?.lastName && user?.lastName?.charAt(0) : "K"}
      </AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
