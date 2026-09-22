import { randomUUID } from "crypto";
import { mkdir, readdir, stat, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "gallery");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export async function GET() {
  try {
    let entries: string[];
    try {
      entries = await readdir(UPLOAD_DIR);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return NextResponse.json({ images: [] });
      }
      throw error;
    }

    const images = (
      await Promise.all(
        entries
          .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
          .map(async (name) => {
            const stats = await stat(path.join(UPLOAD_DIR, name));
            return {
              filename: name,
              url: `/gallery/${name}`,
              uploadedAt: stats.mtimeMs,
            };
          }),
      )
    ).sort((a, b) => b.uploadedAt - a.uploadedAt);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Gallery listing failed:", error);
    return NextResponse.json(
      { error: "Failed to list gallery images." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data request." },
      { status: 400 },
    );
  }

  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "No images provided. Use the \"images\" field." },
      { status: 400 },
    );
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type || "unknown"}.` },
        { status: 415 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `"${file.name}" exceeds the 10 MB limit.` },
        { status: 413 },
      );
    }
  }

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const extension = EXTENSION_BY_TYPE[file.type] ?? "";
        const filename = `${randomUUID()}${extension}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(UPLOAD_DIR, filename), buffer);
        return {
          filename,
          originalName: file.name,
          size: file.size,
          url: `/gallery/${filename}`,
        };
      }),
    );

    return NextResponse.json({ uploaded }, { status: 201 });
  } catch (error) {
    console.error("Gallery upload failed:", error);
    return NextResponse.json(
      { error: "Failed to save uploaded images." },
      { status: 500 },
    );
  }
}
