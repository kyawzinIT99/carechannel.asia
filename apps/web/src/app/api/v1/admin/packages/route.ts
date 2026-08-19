import { NextResponse } from "next/server";
import { GenderScope, Role } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession } from "@/server/auth/session";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

function money(value: unknown) {
  const n = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

function genderOf(value: unknown): GenderScope {
  return value === "MALE" || value === "FEMALE" ? value : "ANY";
}

function lines(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof value === "string") return value.split("\n").map((s) => s.trim()).filter(Boolean);
  return [];
}

export async function POST(request: Request) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    if (body.catalogId) {
      const listPrice = money(body.listPrice);
      const salePrice = money(body.salePrice);
      if (!body.code || !body.nameEn || !body.nameMy || !Number.isFinite(listPrice) || !Number.isFinite(salePrice)) {
        return NextResponse.json({ error: "missing_fields" }, { status: 400 });
      }
      const pkg = await prisma.package.create({
        data: {
          catalogId: String(body.catalogId),
          code: String(body.code).trim(),
          nameEn: String(body.nameEn).trim(),
          nameMy: String(body.nameMy).trim(),
          gender: genderOf(body.gender),
          listPrice,
          salePrice,
          published: true,
          highlight: body.highlight ? String(body.highlight) : null,
          featuresEn: lines(body.featuresEn),
          featuresMy: lines(body.featuresMy),
        },
      });
      return NextResponse.json(pkg, { status: 201 });
    }

    const catalog = await prisma.packageCatalog.create({
      data: {
        code: String(body.code ?? "").trim(),
        nameEn: String(body.nameEn ?? "").trim(),
        nameMy: String(body.nameMy ?? "").trim(),
        sourceUrl: String(body.sourceUrl ?? ""),
        notesEn: String(body.notesEn ?? ""),
        notesMy: String(body.notesMy ?? ""),
        validFrom: new Date(body.validFrom),
        validTo: new Date(body.validTo),
        packages: {
          create: (body.packages ?? []).map((p: Record<string, unknown>) => ({
            code: String(p.code ?? "").trim(),
            nameEn: String(p.nameEn ?? "").trim(),
            nameMy: String(p.nameMy ?? "").trim(),
            gender: genderOf(p.gender),
            listPrice: money(p.listPrice),
            salePrice: money(p.salePrice),
            published: true,
            featuresEn: lines(p.featuresEn),
            featuresMy: lines(p.featuresMy),
          })),
        },
      },
    });
    return NextResponse.json(catalog, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "save_failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
