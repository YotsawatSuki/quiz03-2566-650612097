import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const roomId = request.nextUrl.searchParams.get("roomId");

  readDB();
  const message = DB.messages.find((x) => x.roomId === roomId);
  if (!message) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageList = [];
  for (const roomIds of DB.messages) {
    if (roomIds.roomId === roomId) {
      messageList.push(roomIds);
    }
  }

  const messages = messageList;

  return NextResponse.json({
    ok: true,
    messages,
  });
};

export const POST = async (request) => {
  const body = await request.json();

  const { roomId, messageText } = body;
  readDB();
  const foundRoomId = DB.messages.find((x) => x.roomId === roomId);
  if (!foundRoomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();
  DB.messages.push({ roomId, messageId, messageText });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const body = await request.json();
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

  if (payload.role == "SUPER_ADMIN") {
    // const messageId = body;
    readDB();
    const foundMessage = DB.messages.find(
      (x) => x.messageId === body.messageId
    );
    if (!foundMessage) {
      return NextResponse.json(
        {
          ok: false,
          message: "Message is not found",
        },
        { status: 404 }
      );
    }

    DB.messages = DB.messages.filter((x) => x.messageId !== body.messageId);
    writeDB();

    return NextResponse.json({
      ok: true,
      message: "Message has been deleted",
    });
  }
};
