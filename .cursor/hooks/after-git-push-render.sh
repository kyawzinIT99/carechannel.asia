#!/usr/bin/env python3
"""After a successful git push, POST the CareChannel Render deploy hook."""

from __future__ import annotations

import json
import os
import sys
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def load_payload() -> dict:
    raw = sys.stdin.read()
    try:
        data = json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def text(data: dict, *keys: str) -> str:
    for key in keys:
        val = data.get(key)
        if isinstance(val, str) and val.strip():
            return val
    nested = data.get("tool_input")
    if isinstance(nested, dict):
        for key in keys:
            val = nested.get(key)
            if isinstance(val, str) and val.strip():
                return val
    command = data.get("command")
    if isinstance(command, dict):
        for key in keys:
            val = command.get(key)
            if isinstance(val, str) and val.strip():
                return val
    return ""


def exit_code(data: dict) -> int:
    val = data.get("exit_code", data.get("exitCode", data.get("status", 0)))
    try:
        return int(val)
    except (TypeError, ValueError):
        return 0


def load_hook() -> str:
    hook = os.environ.get("RENDER_DEPLOY_HOOK", "").strip()
    env_path = os.path.join(ROOT, ".env.render")
    if not hook and os.path.isfile(env_path):
        with open(env_path, encoding="utf-8") as fh:
            for line in fh:
                if line.startswith("RENDER_DEPLOY_HOOK="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return hook


def main() -> None:
    data = load_payload()
    command = text(data, "command", "cmd")
    output = text(data, "output", "stdout", "result")
    blob = f"{command}\n{output}"
    if "git push" not in blob:
        print("{}")
        return
    if exit_code(data) != 0:
        print("{}")
        return

    hook = load_hook()
    if not hook:
        print(
            json.dumps(
                {
                    "additional_context": (
                        "git push succeeded. Set RENDER_DEPLOY_HOOK in .env.render "
                        "(Settings → Deploy Hook on carechannel) so the next push "
                        "starts a Render deploy immediately. Also set Auto-Deploy to On Commit."
                    )
                }
            )
        )
        return

    req = urllib.request.Request(hook, method="POST", data=b"")
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            body = resp.read()[:180].decode("utf-8", "replace")
            print(
                json.dumps(
                    {
                        "additional_context": f"Triggered Render carechannel deploy hook (HTTP {resp.status}). {body}"
                    }
                )
            )
    except Exception as exc:
        print(json.dumps({"additional_context": f"Render deploy hook failed: {exc}"}))


if __name__ == "__main__":
    main()
