import { EnvironmentVariables } from "src/config/EnvironmentVariables";

export function getDefaultUserImageUrl(server: EnvironmentVariables['server']) {
  let imgurl: string;
  if (process.env.NODE_ENV == 'production') {
    imgurl = `https://${server.host}/assets/default-images/anonymous.png`;
  } else {
    imgurl = `http://${server.host}:${server.port}/assets/default-images/anonymous.png`;
  }
  return imgurl;
}

export function getDefaultUserThumbnailImageUrl(
  server: EnvironmentVariables['server'],
) {
  let imgurl: string;
  if (process.env.NODE_ENV == 'production') {
    imgurl = `https://${server.host}/assets/default-images/anonymous_thumbnail.png`;
  } else {
    imgurl = `http://${server.host}:${server.port}/assets/default-images/anonymous_thumbnail.png`;
  }
  return imgurl;
}