import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  user:
    | {
        firstName?: string | null;
        lastName?: string | null;
        imageUrl?: string | null;
      }
    | null
    | undefined;
};

const UserAvatar = ({ user }: Props) => {
  const { firstName, lastName, imageUrl } = user || {};
  return (
    <Avatar>
      <AvatarImage src={imageUrl || "/avatar.png"} />
      <AvatarFallback>
        {`${firstName?.charAt(0)}${lastName?.charAt(0)}` || "AK"}
      </AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
