# Closet

A personal dressing room for one phone. Save clothes from any store (photo, store, SKU, link, price), pick one piece per slot like a game closet, and tap **Try on** to see the outfit on her own photo.

- One static page: `index.html`. No server, no database, no third-party scripts.
- Her photo, the closet, the looks and the OpenAI key are stored only in her phone's browser (IndexedDB).
- Images go straight from the phone to OpenAI (`POST https://api.openai.com/v1/images/edits`) and nowhere else. The page's Content-Security-Policy blocks every other destination.

## 1. OpenAI setup (you, once, about 20 minutes)

The ChatGPT app subscription does **not** include the API. This is a separate developer account, paid by you. She never needs an OpenAI login.

1. Go to <https://platform.openai.com> and sign in.
   - **Already have an API organization (for example for work)?** Create a new **project** called `Closet` inside it (top-left project menu → Create project). You don't verify again, and its spending is shown separately.
   - **No API organization yet?** Create one, then verify it (step 2).
2. **Verify the organization** (needed for image models): Settings → Organization → General → **Verify Organization**.
   - Use an original, unexpired government ID (passport is safest) and allow a selfie if asked. No photocopies or screenshots.
   - One person can verify only one organization, and results can't be appealed, so take a clear photo.
3. **Billing**: Settings → Billing → add a card and buy **$5** of credit.
   - Turn **auto-recharge OFF**.
4. **Hard spending limit**: in the `Closet` project → Settings → Limits → Spend → monthly limit **$10** → turn on **Enforce a hard limit**.
   - Also restrict the project's allowed models to the GPT Image models if that option is shown.
5. **API key**: in the `Closet` project → API keys → **Create new secret key**.
   - Name it `closet-phone`.
   - Permissions: **Restricted**. Give the **Images** endpoint **Request** (or "Write") access and leave everything else at **None**. If the dashboard doesn't show a separate Images row, use the narrowest option that still allows images.
   - Set an **expiration date** (for example 1 year).
   - Copy the key (starts with `sk-`). You'll type it into her phone in step 3 below. Don't send it over chat or email.

Cost: roughly **$0.06–0.09 per look** with the default settings (GPT Image 2.6 Sunburst, medium quality). The app shows the real cost of each look from what OpenAI reports, and a monthly total in Settings.

## 2. Hosting (free, about 5 minutes)

It's a static site, so it fits Vercel's free Hobby plan (personal, non-commercial use).

1. Put these files at the root of a GitHub repo (for example `closet`).
2. In Vercel: **Add New → Project →** import the repo. Framework preset: **Other**. No build command, no output directory.
   - If the files are in a `closet/` folder of a bigger repo instead, set **Root Directory** to `closet`.
3. Deploy. You'll get an address like `https://closet-xyz.vercel.app`.
4. Optional: the address is unlisted (`noindex`), but anyone with the link could open the page. It holds no data and no key, so that's harmless.

## 3. Her phone (together, about 5 minutes)

**iPhone (important):**

1. Open the address in **Safari** → **Share** → **Add to Home Screen**.
2. From now on, always open **Closet from the Home Screen icon**.
   - Data saved in a normal Safari tab can be erased after 7 days of not using the site. The Home Screen app is exempt.
   - Data saved in a Safari tab does **not** move to the icon, so do the setup *from the icon*.

**Android:** Chrome → ⋮ → **Add to Home screen** (or **Install app**).

Then, inside the app:

1. **Settings → API key** → paste the key → **Save key**.
2. **Settings → Your photo**: a vertical, head-to-toe photo in fitted clothes (leggings and a tank top work well), plain background, good light, arms a little away from the body.
3. **Closet → + Add item**: a photo or screenshot of a piece, cropped to just the item, plus a slot (Top, Bottom, Dress, Outerwear, Shoes, Glasses, Bag, Extra). Store, SKU, link, price and size are optional.
4. **Dress up**: tap a slot, pick the piece, tap **Try on**. Keep the app open and the screen on for 30–90 seconds.

**First test:** one piece only. If it works, the phone can reach OpenAI directly and everything is set.

## 4. Backups

Everything lives only on that phone. **Settings → Export closet** saves a `.json` file (on iPhone: Files → Downloads). **Import backup** restores it. The backup never includes the API key. Export now and then, and before changing phones.

## Troubleshooting

| Message | What to do |
|---|---|
| The OpenAI key was rejected | Re-paste the key in Settings. Check it hasn't expired or been deleted. |
| The OpenAI organization has to be verified | Finish step 1.2. Access can take a few minutes after approval. |
| This key isn't allowed to create images | Edit the key's permissions: Images → Request/Write. |
| The monthly limit or the prepaid credit has run out | Add credit or raise the hard limit in the project. |
| OpenAI's safety filter blocked this outfit | Expected for swimwear, lingerie and sheer items. Try another piece. |
| Couldn't reach OpenAI | Check the connection. If it keeps failing on a good connection, OpenAI may have temporarily broken direct-from-phone access (it happened twice in the last year, fixed within a day). |
| The app was closed or the screen locked while waiting | Keep the app in front until the look appears. |

**Her face changes too much:** Settings → Edit strength → **Low**, and try a sharper base photo with her face clearly visible.

## Settings reference

- **Model**: GPT Image 2.6 Sunburst (default, most detail), 2.6 Flare (faster), 2.5 Sunburst.
- **Quality**: Low / Medium (default) / High. Medium is OpenAI's recommended setting for this exact use.
- **Edit strength** (2.6 models only): Auto (OpenAI default) / Low / Medium / High. Lower keeps more of the original photo.

Every request uses a 1024×1536 portrait output, `moderation: low`, JPEG output, and the identity-preserving prompt from OpenAI's image prompting guide ("Preserve identity and change clothing").
