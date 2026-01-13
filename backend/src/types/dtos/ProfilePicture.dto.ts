export interface UpdateProfilePictureSuccessResponse {
  message: string;
}

export interface GetProfilePictureSuccessResponse {
  profilePicture: string;
}

export interface GetProfilePictureQuery {
  userId?: string;
}

export interface ProfilePictureFile extends Express.Multer.File {
  buffer: Buffer;
  mimetype: string;
}
