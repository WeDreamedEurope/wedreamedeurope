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
