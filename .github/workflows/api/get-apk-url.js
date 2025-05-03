export default async function handler(req, res) {
  const userZipUrl = req.body?.zipUrl;

  if (!userZipUrl) {
    return res.status(400).json({ error: 'Missing zip URL' });
  }

  // Trigger GitHub Actions workflow
  const triggerUrl = `https://api.github.com/repos/<your-username>/<repo>/actions/workflows/build-apk.yml/dispatches`;

  const response = await fetch(triggerUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: { code_zip_url: userZipUrl },
    }),
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to trigger build' });
  }

  res.status(200).json({ message: 'Build started' });
}
