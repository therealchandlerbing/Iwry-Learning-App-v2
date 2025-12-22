import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  const sizeNum = parseInt(size, 10);

  // Validate size
  if (isNaN(sizeNum) || sizeNum < 16 || sizeNum > 1024) {
    return new Response("Invalid size", { status: 400 });
  }

  // Generate the icon using ImageResponse
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #009c3b 0%, #007a2f 100%)",
          borderRadius: sizeNum * 0.2,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Stylized "i" for Iwry */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Dot of the i */}
            <div
              style={{
                width: sizeNum * 0.15,
                height: sizeNum * 0.15,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                marginBottom: sizeNum * 0.05,
              }}
            />
            {/* Stem of the i */}
            <div
              style={{
                width: sizeNum * 0.12,
                height: sizeNum * 0.4,
                backgroundColor: "#ffffff",
                borderRadius: sizeNum * 0.06,
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: sizeNum,
      height: sizeNum,
    }
  );
}
