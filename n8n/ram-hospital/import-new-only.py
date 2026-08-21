#!/usr/bin/env python3
"""Import Ram Hospital n8n workflows only. Never PATCH BCC, PDF, or SDDP."""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from pathlib import Path

PROTECTED = ("BCC", "PDF", "SDDP")
N8N_URL = "https://n8n-al8a.srv1707349.hstgr.cloud"
ROOT = Path(__file__).resolve().parent
WORKFLOWS = [
    ROOT / "inquiry-alert.json",
    ROOT / "telegram-ingress.json",
    ROOT / "appointment-reminder.json",
    ROOT / "google-form-inquiry.json",
]


def load_key() -> str:
    key = os.environ.get("N8N_API_KEY", "").strip()
    if key:
        return key
    for line in Path("/Users/berry/Documents/Cursor/BCC/.dev.vars").read_text().splitlines():
        if line.startswith("N8N_API_KEY="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("N8N_API_KEY missing")


def api(method: str, path: str, body: dict | None = None):
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(
        N8N_URL + path,
        data=data,
        method=method,
        headers={
            "X-N8N-API-KEY": load_key(),
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"{method} {path} failed: {exc.code}\n{detail}") from exc


def is_protected(name: str) -> bool:
    upper = name.upper()
    return any(tag in upper for tag in PROTECTED)


def main() -> None:
    existing = api("GET", "/api/v1/workflows")
    items = existing.get("data", existing) if isinstance(existing, dict) else existing
    by_name = {row["name"]: row for row in items}
    for path in WORKFLOWS:
        payload = json.loads(path.read_text())
        name = payload["name"]
        if is_protected(name):
            print("skip protected name", name)
            continue
        create_body = {
            "name": payload["name"],
            "nodes": payload["nodes"],
            "connections": payload["connections"],
            "settings": payload.get("settings") or {"executionOrder": "v1"},
        }
        found = by_name.get(name)
        if found and is_protected(found["name"]):
            print("refuse to touch", found["name"], found["id"])
            continue
        if found:
            wf_id = found["id"]
            if name in ("Ram Hospital Google Form to CRM", "Ram Hospital Inquiry Alert"):
                api("PUT", f"/api/v1/workflows/{wf_id}", create_body)
                print("updated", name, wf_id)
            else:
                print("already exists", name, wf_id, "activate only")
        else:
            created = api("POST", "/api/v1/workflows", create_body)
            wf_id = created["id"]
            print("created", name, wf_id)
        try:
            api("POST", f"/api/v1/workflows/{wf_id}/activate", {})
            print("active", name)
        except SystemExit as exc:
            print("activate skipped", name, str(exc)[:200])


if __name__ == "__main__":
    main()
