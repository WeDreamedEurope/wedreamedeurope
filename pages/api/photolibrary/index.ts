import {
  getPhotosInRadiusAndTimeRange,
  getPhotosInRadiusAndTimeRangeRedux,
  Photo_Location_Select,
} from "@/server/gis_query";
import { isValid } from "date-fns";
import { toDate } from "date-fns-tz";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log(`Do You Read ME?!`);
    return getPhotosForLocAndRange(req, res);
  }
}

const getPhotosForLocAndRange = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { locationTakenAt, dateTakenAt, photoId } = JSON.parse(
    req.body
  ) as Photo_Location_Select;

  const timeShenangians = await getPhotosInRadiusAndTimeRangeRedux(
    locationTakenAt,
    100,
    toDate(dateTakenAt!),
    10
  );

  return res.status(200).json(timeShenangians);
};
