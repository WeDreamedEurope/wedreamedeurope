import {
  getPhotosInRadiusAndTimeRangeRedux,
  Photo_Query
} from "@/server/gis_query";
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
  const { locationTakenAt, dateTakenAt, radius } = JSON.parse(
    req.body
  ) as Photo_Query;

  const timeShenangians = await getPhotosInRadiusAndTimeRangeRedux(
    locationTakenAt,
    radius,
    toDate(dateTakenAt!),
    10
  );

  return res.status(200).json(timeShenangians);
};
