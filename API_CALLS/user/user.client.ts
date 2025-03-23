export const GetUserPhotos = async () => {
  const response = await fetch("/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const photos = await response.json();
  return photos;
};

export const DeletePhotos = async (photoId: number, userId: string) => {
  const response = await fetch(`/api/user?photoId=${photoId}&userId=${userId}`, {
    method: "DELETE",
  });

  return await response.json()
  
};



export default { GetUserPhotos, DeletePhotos }