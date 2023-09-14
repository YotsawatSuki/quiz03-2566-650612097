import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  const rooms = DB.rooms;
  const totalRooms = rooms.length;
  return NextResponse.json({
    ok: true,
    message: rooms,
    totalRooms,
  });
};

export const POST = async (request) => {
  const body = await request.json();
  const roomName = body.roomName;
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  if (payload.role === "ADMIN" || payload.role === "SUPER_ADMIN") {
    readDB();
    const foundroom = DB.rooms.find((std) => std.roomName === roomName);
    if (foundroom) {
      return NextResponse.json(
        {
          ok: false,
          message: `Room ${roomName} already exists`,
        },
        { status: 400 }
      );
    }

    const roomId = nanoid();
    DB.rooms.push({ roomId, roomName });
    writeDB();

    return NextResponse.json({
      ok: true,
      roomId: roomId,
      message: `Room ${roomName} has been created`,
    });
  }
};
