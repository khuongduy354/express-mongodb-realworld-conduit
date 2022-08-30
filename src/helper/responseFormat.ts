import { UserDocument } from "./../models/user.model";
export const parseUserResponse = (user: UserDocument) => {
  return {
    user: {
      username: user.username,
      bio: user.bio ? user.bio : "",
      image: user.image ? user.image : "",
      email: user.email,
      token: user.token,
    },
  };
};
