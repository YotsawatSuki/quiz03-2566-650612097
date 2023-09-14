import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Yotsawat Sukinee",
    studentId: "650612097",
  });
};
