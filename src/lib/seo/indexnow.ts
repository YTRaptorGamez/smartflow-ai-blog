export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  const host = 'smartflow-ai-blog.vercel.app';
  const key = 'e4b37f2890a14bcebc52945d8b812a10';
  const keyLocation = `https://${host}/${key}.txt`;

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: urls,
      }),
    });

    console.log(`[IndexNow] Submitted ${urls.length} URLs. Response status: ${res.status}`);
    return res.status === 200 || res.status === 202;
  } catch (err) {
    console.error('[IndexNow] Error submitting to IndexNow:', err);
    return false;
  }
}
