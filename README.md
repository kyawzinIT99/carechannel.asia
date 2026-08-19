# CareChannel (`carechannel.asia`)

Platform HTTPS for hospital partner visit channels. Chiangmai Ram Hospital is the first tenant. Public copy for that tenant is taken from [chiangmairam.com](https://www.chiangmairam.com) and [ChiangmaiRam.myanmar](https://www.facebook.com/ChiangmaiRam.myanmar).

This app does not invent medical information. Specialty centres and 2026 check-up prices are hospital-published only. AI only fills approved templates. n8n sends Telegram and email.

Do not import or edit existing Hostinger workflows named BCC, PDF, or SDDP. Import only JSON under `n8n/ram-hospital/`. Mail is sent with the existing n8n Gmail credential **itsolutions.mm@gmail.com**. Telegram uses the Ram Hospital bot — attach it as credential `RAM_HOSPITAL_TELEGRAM` on the new workflows only.

## Specialty sources (official site)

- List: https://www.chiangmairam.com/index.php/centeronly
- Cardiac Balloon Center: https://www.chiangmairam.com/index.php/readcenter_clinic/2
- Stroke Center: https://www.chiangmairam.com/index.php/readcenter_clinic/7
- Children's Hospital: https://www.chiangmairam.com/readcenter_clinic/8
- Health Center (dental, skin, check-up, physiotherapy, pharma): https://chiangmairam.com/readcenter_clinic/23
- Contact phones: https://www.chiangmairam.com/contactus
- Interpreters: https://chiangmairam.com/news_detail/208
- Packages: https://chiangmairam.com/news_detail/970

## Local

```bash
cd apps/web
cp .env.example .env
# set JWT_SECRET (>= 32 chars). DATABASE_URL is SQLite: file:./prisma/dev.db
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open http://localhost:3000/en and http://localhost:3000/my

## Deploy on Render (production)

This portal runs on **Render Starter**, not a VPS. n8n stays on Hostinger.

Typical bill: **Starter web $7/mo + 1 GB disk $0.25/mo ≈ $7.25**. The database is a SQLite file on that disk (`file:/var/data/carechannel.db`), same idea as SDDP. No Neon.

On the existing carechannel service: Environment → `DATABASE_URL` = `file:/var/data/carechannel.db` (must match the Disk mount path). Then Manual Deploy. After Live, seed once from a one-off job or laptop is not needed if you run seed on first boot — run from Render Shell:

```bash
cd /opt/render/project/src/apps/web
npx prisma db seed
```

Or from your Mac after setting DATABASE_URL is only local. For production seed, use Render **Shell** on carechannel after migrate:

```bash
npx prisma db seed
```

1. This repo: https://github.com/kyawzinIT99/carechannel.asia
2. On Render: New → Blueprint → select the repo (`render.yaml`).
3. Region **Singapore**, plan **Starter**, service name `carechannel`.
4. Paste env values when prompted:
   - `SITE_URL` — first `https://carechannel.onrender.com`, later `https://carechannel.asia`
   - `DATABASE_URL` — Neon (or other) Postgres connection string
   - `JWT_SECRET` — at least 32 characters
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`
   - `N8N_WEBHOOK_SECRET`, `TELEGRAM_STAFF_CHAT_ID`, `OPENAI_API_KEY`, SMTP if used
5. After the first deploy, from a laptop (with `DATABASE_URL` pointed at Neon):

```bash
cd apps/web
npm run db:seed
```

6. Custom domain: Render → carechannel → Settings → Custom Domain → `carechannel.asia`, then point DNS CNAME to `carechannel.onrender.com`.
7. In Hostinger n8n, set `RAM_HOSPITAL_APP_URL` to the same `SITE_URL`. Do not change BCC / PDF / SDDP workflows.

Public visitors use **CareChannel** HTTPS. `chiangmairam.com` stays the hospital website.

## n8n (new Ram Hospital workflows only)

Hostinger n8n: `https://n8n-al8a.srv1707349.hstgr.cloud`

1. Do **not** open or edit BCC, PDF, or SDDP workflows.
2. Import:
   - `n8n/ram-hospital/inquiry-alert.json`
   - `n8n/ram-hospital/telegram-ingress.json`
   - `n8n/ram-hospital/appointment-reminder.json`
3. Gmail nodes already point at **itsolutions.mm@gmail.com**.
4. Attach the Telegram bot as `RAM_HOSPITAL_TELEGRAM` on the Ram Hospital Telegram nodes only.
5. Set n8n env: `RAM_HOSPITAL_WEBHOOK_SECRET`, `RAM_HOSPITAL_STAFF_CHAT_ID`, `RAM_HOSPITAL_APP_URL` (the Render `SITE_URL`, e.g. `https://carechannel.onrender.com`).
6. Set app env `N8N_INQUIRY_WEBHOOK` to `https://n8n-al8a.srv1707349.hstgr.cloud/webhook/ram-hospital-inquiry` and `STAFF_ALERT_EMAIL=itsolutions.mm@gmail.com`.
