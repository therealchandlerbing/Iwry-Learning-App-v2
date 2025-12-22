import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Icon dimension ratios for consistent scaling
const BORDER_RADIUS_RATIO = 0.2;
const DOT_SIZE_RATIO = 0.15;
const DOT_MARGIN_RATIO = 0.05;
const STEM_WIDTH_RATIO = 0.12;
const STEM_HEIGHT_RATIO = 0.4;
const STEM_RADIUS_RATIO = 0.06;

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
          borderRadius: sizeNum * BORDER_RADIUS_RATIO,
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
                width: sizeNum * DOT_SIZE_RATIO,
                height: sizeNum * DOT_SIZE_RATIO,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                marginBottom: sizeNum * DOT_MARGIN_RATIO,
              }}
            />
            {/* Stem of the i */}
            <div
              style={{
                width: sizeNum * STEM_WIDTH_RATIO,
                height: sizeNum * STEM_HEIGHT_RATIO,
                backgroundColor: "#ffffff",
                borderRadius: sizeNum * STEM_RADIUS_RATIO,
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
